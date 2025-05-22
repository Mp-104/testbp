import { queryUsageStats } from '@brighthustle/react-native-usage-stats-manager';
import React, {createContext, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import UsageStats from 'react-native-usage-stats';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, collection, getDocs, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';

import { auth, db } from './firbaseConfig';

interface UsageStatsContextProps {
    usageStats: any;
    setUsageStats: React.SetStateAction<any>;
    energy: any,
    setEnergy: SetStateAction<any>;
    remainingGametime: any;
    setRemainingGametime: SetStateAction<any>;
    allotedGametime: number;
};

const UsageStatsContext = createContext<UsageStatsContextProps | undefined>(undefined);

export const UsageStatsProvider = ( {children} ) => {
    const [usageStats, setUsageStats] = useState<any>("");
    const [energy, setEnergy] = useState<any>(100);
    const [remainingGametime, setRemainingGametime] = useState(1000);
    const [allotedGametime, setAllotedGametime] = useState<number>(25200);

    const [newStat, setNewStat] = useState(); // may be removed, is not
    const [prevStat, setPrevStat] = useState();
    const [prevTime, setPrevTime] = useState();

    /* const getWeek = () => {
        const date = new Date();       
        const start = new Date(date.getFullYear(), 0, 1);
        const diff = (date - start + ((start.getTimezoneOffset() - date.getTimezoneOffset())) * 60000);

        const oneWeek = 1000 * 60 * 60 * 24 * 7;
        //console.log("currentWeek: ", (diff/oneWeek) + 1);
        return Math.floor((diff/oneWeek) + 1)

    } */

    const getWeek = () => {
        const date = new Date();

        const day = date.getDay();
        const diff = date.getDate() + 4 - (day === 0 ? 7: day);
        const thursday = new Date(date.setDate(diff));
        const yearStart = new Date(thursday.getFullYear(), 0, 1);
        const weekNo = Math.ceil((((thursday - yearStart) / 86400000) + 1 ) / 7);

        return weekNo;
    }

    const currentUser = auth.currentUser

    const userId = currentUser?.uid

    useEffect(() => {
        let prevStatLocal: number | undefined;
        let lastCheckedDay = new Date().getDate();

        const interval = setInterval(async () => {
            
            //const docRef = doc(db, "children", parentId, "calendar", date);
            try {
                const docRef2 = doc(db, "children", userId);
                //const docSnap = await getDoc(docRef);
                const docSnap2 = await getDoc(docRef2);
                
                if(docSnap2.exists()) {
                    const data = docSnap2.data();
                    data.gameTime;
                    //console.log("data.gameTime: ", data.gameTime);
                    setAllotedGametime(data.gameTime);
                }
                
                //console.log("context, docSnap2: ", docSnap2.data())
            } catch (error) {
                console.log("Gick inte att hämta data från Firestore is UsageStatsContext: ", error);
                
            }
            

            const currentWeek = getWeek();
            //const currentIsoWeek = getIsoWeek();
            const week = await AsyncStorage.getItem("week");
            const storedGametime = await AsyncStorage.getItem("gameTime")

            const lastWeek = week ? Number(week) : currentWeek;
            const currentGametime = storedGametime ? Number(storedGametime) : 1000;

            if (currentWeek !== lastWeek) {
                const newGametime = currentGametime + (allotedGametime ?? 25200); // 25200 is 7 hours
                setRemainingGametime(newGametime)
                await AsyncStorage.setItem("gameTime", newGametime.toString());
                await AsyncStorage.setItem("week", currentWeek.toString());
                const screenTimeOfLastWeek = await queryUsageStats(1, new Date().getTime() - 7 * 24 * 60 * 60 * 1000, new Date().getTime());
                
                try {
                    const docRef = doc(db, "children", userId, "weeks", week);
                    await setDoc(docRef, {screenTime: screenTimeOfLastWeek})
                } catch (error) {
                    console.log("Error setting weekly screen time: ", error)
                }
                
            }
            //console.log("Current week: ", currentWeek)
            //console.log("Current ISO week: ", currentIsoWeek)

            //console.log("usageStatsContext", remainingGametime)
            const now = new Date() //.getTime();
            const pauseUntil = await AsyncStorage.getItem("pauseUntil");
            const update = await AsyncStorage.getItem("update");
            const currentDay = now.getDate();
            //console.log("update: ", update)

            // Reset energy to 100 when day changes
            if (currentDay !== lastCheckedDay) {
                setEnergy(100);
                await AsyncStorage.setItem("energy1", "100");
                lastCheckedDay = currentDay;
                console.log("Day changed, energy resetted");
            }

            if(pauseUntil && now.getTime() < Number(pauseUntil)) {
                console.log("energy consumption paused until: ", pauseUntil)
                await AsyncStorage.setItem("update", "update");
                return;
            }
            //await fetchAndUpdateUsageStats(setUsageStats, setEnergy);

            //console.log("newStatBefore: ", newStat);
            const newStat1 = await fetchAndUpdateUsageStats(setUsageStats, setEnergy);
            //console.log("newStat1: ", newStat1);


            let totalEnergyLoss = 0;

            const usageDifference = newStat1 - prevStat;
            //console.log("prevStat: ", prevStat)

            if(usageDifference > 0 ) {
                totalEnergyLoss += usageDifference/1
            }

            //console.log("usageDifference: " , usageDifference)
            //console.log("totalEnergyLoss: ", totalEnergyLoss)
            if(update != "update") {
                setEnergy((prevEnergy: number) => Math.max(1, Math.min(100,  prevEnergy - totalEnergyLoss )));

            };
            
            AsyncStorage.setItem("energy1", energy.toString())

            const currentEnergy = await AsyncStorage.getItem("energy1");
            //console.log("async currentEnergy: ", currentEnergy)

            setPrevStat(newStat1);
            //setNewStat(newStat1);
            await AsyncStorage.setItem("update", "notupdate");

            // remainingGametime
            const currentDate = new Date();
            const currentTime = currentDate.getTime();
            const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime();
            
            const usedGameApps = await queryUsageStats(0, startOfDay, currentTime);
           // console.log("usedGameApps", usedGameApps)
            //const gameTargetPackages = ["com.fastemulator.gbafree"];
           // console.log("MTS0: ", usedGameApps)
            
            const desiredPackages = [
                "com.discord",
                "com.google.android.youtube",
                "com.tinder",
                "com.fastemulator.gbafree"
            ];
            
            // Filter the data
            const totalTime = desiredPackages.reduce((sum, pkg) => {
                const entry = usedGameApps[pkg];
                return entry ? sum + entry.totalTimeInForeground : sum;
            }, 0);

            let sessionTime = 0;
            //const prevTimeRef = useRef(0);

            const gameSession = totalTime - prevTime;

            if(gameSession > 0) {
                sessionTime+= gameSession;
            }
            
            setRemainingGametime(prev => prev - sessionTime)
            setPrevTime(totalTime);
            await AsyncStorage.setItem("gameTime", remainingGametime.toString());
            //console.log("totalTime", totalTime);
            //console.log("remainingGametime: ", remainingGametime)

            
            

        }, 3000);

        return ()=> clearInterval(interval); // without the clearInterval, prevStat and newStat will fluctuate

    }, [prevStat, remainingGametime, userId]);

    return (
        <UsageStatsContext.Provider value={{usageStats, setUsageStats, energy, setEnergy, remainingGametime, setRemainingGametime, allotedGametime}}>
            {children}
        </UsageStatsContext.Provider>
    )
};

export const useUsageStats = (): UsageStatsContextProps => {
    const context = useContext(UsageStatsContext);

    if(!context) {
        throw new Error ("useUsageStats must be used within a UsageStatsProvider");
    }

    return context;
}

async function fetchAndUpdateUsageStats(setUsageStats: React.Dispatch<React.SetStateAction<any>>, setEnergy:React.Dispatch<React.SetStateAction<any>>) {

    const currentDate = new Date();
    const currentTime = currentDate.getTime();

    const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime();//new Date(currentDate.setHours(0, 0, 0, 0)).getTime();

    const result2 = await UsageStats.queryUsageStats(startOfDay, currentTime);
    
    const result3 = await queryUsageStats(0, startOfDay, currentTime );

    const YT = Object.values(result3).filter(item => item.appName === "YouTube").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
    const Instagram = Object.values(result3).filter(item => item.appName === "Instagram").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
    const TikTok = Object.values(result3).filter(item => item.appName === "TikTok").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
    const Snapchat = Object.values(result3).filter(item => item.appName === "Snapchat").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
    const Triller = Object.values(result3).filter(item => item.appName === "Triller").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
    const Roblox = Object.values(result3).filter(item => item.appName === "Roblox").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
    const Fortnite = Object.values(result3).filter(item => item.appName === "Fortnite").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
    const AmongUs = Object.values(result3).filter(item => item.appName === "Among Us").reduce((sum, item) => sum + item.totalTimeInForeground, 0);

    const badAppsTotalTimeInForeground = YT + Instagram + TikTok + Snapchat + Triller + Roblox + Fortnite + AmongUs; 

    
    const apps = Object.entries(result3).map(([packageName, appData]) => ({
        packageName,
        ...appData
      }));

    const sortedApps = apps.sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground);

    const sortedApps2 = result2?.sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground);
    setUsageStats(result3);

    const calculateEnergy = () => {
        let energi = 100 - badAppsTotalTimeInForeground/1000;

        //console.log("apps[1]: ", apps[1])

        if (energi <= 0) {
            energi = 1
        }

        

        return energi.toFixed(2).toString();
    }

    //console.log("calculateEnergy.toString", calculateEnergy());
    AsyncStorage.setItem("energy", calculateEnergy());
   // console.log("AsyncStorage.getItem('energy'); ", AsyncStorage.getItem("energy"));

    let x;
    AsyncStorage.getItem("energy").then((item) => {
        //console.log("item: ", item);
        x = item;
    });

    //console.log("x: ", x);
    
    //setEnergy(calculateEnergy)

    return badAppsTotalTimeInForeground;
    
}

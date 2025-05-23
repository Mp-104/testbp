import React, { useEffect, useState } from "react";
import { View, Text, Switch, FlatList } from "react-native";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firbaseConfig";
import { auth } from "./Firebase";

const AppPermissionsScreen = () => {
    const [permissions, setPermissions] = useState({});

    const currentUser = auth.currentUser

    const childId = currentUser?.uid;

    useEffect(() => {
        const fetchPermissions = async () => {
            const ref = collection(db, "children", childId, "appPermissions");
            const snap = await getDocs(ref);
            const result = {};
            snap.forEach(doc => {
                const { packageName, status } = doc.data();
                result[packageName] = status;
            });
            setPermissions(result);
        };

        if (childId) {
            fetchPermissions();
        }
    }, [childId]);

    const togglePermission = async (packageName, appName) => {
        const currentStatus = permissions[packageName];
        const newStatus = currentStatus === "accepted" ? "unaccepted" : "accepted";

        await setDoc(doc(db, "children", childId, "appPermissions", packageName), {
            appName,
            packageName,
            status: newStatus
        });

        setPermissions(prev => ({ ...prev, [packageName]: newStatus }));
    };

    const data = Object.entries(permissions).map(([pkg, status]) => ({
        key: pkg,
        appName: pkg, // Assuming packageName is the app name or that you can derive appName from packageName
        status: status || "unreviewed",
    }));

    return (
        <FlatList
            data={data}
            style={{ marginBottom: 10 }}
            renderItem={({ item }) => {
                // Set background color based on status
                let backgroundColor;
                if (item.status === "unreviewed") backgroundColor = "#D6E4FF"; // light blue/purple
                else if (item.status === "accepted") backgroundColor = "#DFF5E1"; // light green
                else if (item.status === "unaccepted") backgroundColor = "#FFD6D6"; // light red/pink
                else backgroundColor = "#fff"; // default white

                return (
                    <View
                        style={{
                            padding: 12,
                            borderBottomWidth: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor,
                        }}
                    >
                        <View>
                            <Text>{item.appName}</Text>
                            <Text style={{ color: "gray" }}>{item.key}</Text>
                        </View>
                        <Switch
                            value={item.status === "accepted"}
                            onValueChange={() => togglePermission(item.key, item.appName)}
                        />
                    </View>
                );
            }}
            keyExtractor={(item) => item.key}
        />

    );
};

export default AppPermissionsScreen;

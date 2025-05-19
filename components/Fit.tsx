import GoogleFit, { BucketUnit, Scopes } from 'react-native-google-fit';
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, PermissionsAndroid } from 'react-native';
import React from 'react';

const Fit = () => {
    const [result, setResult] = useState(null); // Step count result
    const [isAuthorized, setIsAuthorized] = useState(false); // Track authorization status
    const [loading, setLoading] = useState(true); // Track loading state

    // Request Activity Recognition permission on Android
    const requestActivityRecognitionPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
                {
                    title: "Activity Recognition Permission",
                    message:
                        "This app needs access to your step count data in Google Fit. Please allow this permission.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Activity recognition permission granted");
            } else {
                console.log("Activity recognition permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    // Request authorization and permissions
    useEffect(() => {
        const options = {
            scopes: [
                Scopes.FITNESS_ACTIVITY_READ,
                Scopes.FITNESS_BODY_READ,
                Scopes.FITNESS_ACTIVITY_WRITE,
                Scopes.FITNESS_BODY_WRITE,
            ]
        };

        // Check if Google Fit is authorized
        GoogleFit.checkIsAuthorized()
            .then((authorized) => {
                if (authorized) {
                    console.log("Google Fit is authorized");
                    setIsAuthorized(true);
                } else {
                    console.log("Google Fit is not authorized");
                    GoogleFit.authorize(options) // Ensure the user grants permission
                        .then((authResult) => {
                            if (authResult.success) {
                                console.log("Google Fit authorization successful");
                                setIsAuthorized(true);
                            } else {
                                console.log("Google Fit authorization failed", authResult.message);
                                setIsAuthorized(false);
                            }
                        })
                        .catch((err) => {
                            console.log("Google Fit authorization error", err);
                            setIsAuthorized(false);
                        });
                }
            })
            .catch((err) => {
                console.log("Error checking Google Fit authorization", err);
                setIsAuthorized(false);
            });

        // Request Activity Recognition Permission
        requestActivityRecognitionPermission();
    }, []);

    // Define options for the step count data query
    const opt = {
        startDate: "2025-03-24T00:00:17.971Z", // ISO8601Timestamp
        endDate: new Date().toISOString(), // ISO8601Timestamp
        bucketUnit: BucketUnit.DAY, // Optional - default is "DAY"
        bucketInterval: 1, // Optional - default 1
    };

    // Fetch daily step count samples after Google Fit is authorized
    useEffect(() => {
        if (isAuthorized) {
            const fetchData = async () => {
                setLoading(true); // Set loading to true while fetching data
                try {
                    const stepCountResult = await GoogleFit.getDailyStepCountSamples(opt);
                    console.log("Step count result: ", stepCountResult); // Log the result
                    setResult(stepCountResult); // Update state with the result
                } catch (error) {
                    console.error("Error fetching daily step count samples:", error);
                } finally {
                    setLoading(false); // Set loading to false after fetching
                }
            };

            fetchData(); // Call the fetch function
        }
    }, [isAuthorized]); // Only run after isAuthorized changes

    return (
        <View>
            <ScrollView>
                {loading ? (
                    <Text>Loading data...</Text>
                ) : result ? (
                    <Text>{JSON.stringify(result, null, 2)}</Text>
                ) : (
                    <Text>No data available or no steps recorded yet.</Text>
                )}
            </ScrollView>
        </View>
    );
};

export default Fit;

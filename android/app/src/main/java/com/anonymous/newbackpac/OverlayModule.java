package com.anonymous.newbackpac;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.view.WindowManager;
import android.widget.TextView;
import android.view.Gravity;
import android.graphics.PixelFormat;
import android.view.ViewGroup;
import android.view.View;
import android.content.Context;
import android.graphics.drawable.AnimationDrawable;
import android.widget.ImageView;
import android.view.MotionEvent;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import android.media.MediaPlayer;
import android.app.usage.UsageEvents;
import android.app.usage.UsageStatsManager;
import android.app.usage.UsageStats;
import android.os.Looper;
import android.os.Handler;


import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
//import java.util.logging.Handler;

//import javax.security.auth.callback.Callback;

import com.facebook.react.bridge.Arguments;

import androidx.annotation.Nullable;
import android.util.Log;
import java.util.List;

public class OverlayModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private View overlayView;
    private MediaPlayer mediaPlayer;
    private Handler handler;
    private Runnable runnable;

    public OverlayModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName () {
        return "OverlayModule";
    }

    @ReactMethod
    public void requestOverlayPermission () {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {

            if (!Settings.canDrawOverlays(reactContext)) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package: " + reactContext.getPackageName()));
                
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

                reactContext.startActivity(intent);
            }
        }
    }

    private void launchMainActivity () {
        Intent intent = new Intent(reactContext, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        reactContext.startActivity(intent);
    };

    @ReactMethod
    public void launchApp () {
        launchMainActivity();
    };

    @ReactMethod
    public void showOverlayWarning () {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(reactContext)) {
            return;
        }

        WindowManager wm = (WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE);

        if (overlayView != null) {
            return;
        }

        TextView textView = new TextView(reactContext);
        textView.setText("5 minuter kvar");
        textView.setTextSize(18);
        textView.setBackgroundColor(0x88FF0000);
        textView.setPadding(30, 30, 30, 30);

        overlayView = textView;

        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.O ?
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY : 
                WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        );
        params.gravity = Gravity.CENTER;
        params.x = 100;
        params.y = 300;

        wm.addView(overlayView, params);

    }

    @ReactMethod
    public void showOverlay () {
        Log.d("OverlayModule", "showOverlay()");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(reactContext)) {
            return;
        }
        //launchMainActivity();

        WindowManager wm = (WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE);

        if (overlayView != null ) return;

        FrameLayout container = new FrameLayout(reactContext);



        /* ImageView animatedView = new ImageView(reactContext);
        animatedView.setBackgroundResource(R.drawable.anim); // your anim.xml file

        AnimationDrawable animation = (AnimationDrawable) animatedView.getBackground();
        animation.start();
        layout.addView(animatedView); */

        ImageView animatedView = new ImageView(reactContext);
        //animatedView.setBackgroundResource(R.drawable.anim); // XML file
        animatedView.setBackgroundResource(R.drawable.sonimation); // XML file

        //Adjust size
        FrameLayout.LayoutParams animParams = new FrameLayout.LayoutParams(
            1500, // width ViewGroup.LayoutParams.WRAP_CONTENT,
            1000  // height ViewGroup.LayoutParams.WRAP_CONTENT
        );

        animParams.gravity = Gravity.CENTER;
        container.addView(animatedView, animParams);

        // ===== Close Button =====
        TextView closeBtn = new TextView(reactContext);
        closeBtn.setText("✕");
        closeBtn.setTextSize(18);
        closeBtn.setPadding(10, 0, 10, 0);
        closeBtn.setBackgroundColor(0xAA000000);
        closeBtn.setTextColor(0xFFFFFFFF);
        closeBtn.setOnClickListener(v -> removeOverlay());

        FrameLayout.LayoutParams closeParams = new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        );

        closeParams.gravity = Gravity.TOP | Gravity.END;
        closeParams.setMargins(0, 10, 10, 0); // top-right margin
        container.addView(closeBtn, closeParams);

        //overlayView = animatedView;
        overlayView = container;
        // Start the animation
        animatedView.post(() -> {
            AnimationDrawable animation = (AnimationDrawable) animatedView.getBackground();
            animation.start();
        });

        


        /* TextView textView = new TextView(reactContext);
        textView.setText("Hello from overlay!");
        textView.setTextSize(18);
        textView.setBackgroundColor(0x88FF0000);
        textView.setPadding(30, 30, 30, 30);

        overlayView = textView; */

        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.O ?
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY :
                WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | 
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        );
        params.gravity = Gravity.TOP | Gravity.LEFT;
        params.x = 100;
        params.y = 300;

        wm.addView(overlayView, params);

        mediaPlayer = MediaPlayer.create(reactContext, R.raw.test_sound);
        mediaPlayer.start();
        mediaPlayer.setOnCompletionListener(mp -> {
            mp.release();
            mediaPlayer = null;
        });

        overlayView.setOnTouchListener((v, event) -> {
            if(event.getAction() == MotionEvent.ACTION_UP) {
                launchMainActivity();

                if (overlayView != null) {
                    //WindowManager wm = (WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE);
                    wm.removeView(overlayView);
                    overlayView = null;
                }
        
                if(mediaPlayer != null) {
                    if(mediaPlayer.isPlaying()) {
                        mediaPlayer.stop();
                    }
        
                    mediaPlayer.release();
                    mediaPlayer = null;
                }
            }

            return true;
        });
    }

    @ReactMethod
    public void removeOverlay () {
        if (overlayView != null) {
            WindowManager wm = (WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE);
            wm.removeView(overlayView);
            overlayView = null;
        }

        if(mediaPlayer != null) {
            if(mediaPlayer.isPlaying()) {
                mediaPlayer.stop();
            }

            mediaPlayer.release();
            mediaPlayer = null;
        }
    }

    @ReactMethod
    public void getRecentUsageEvents (Promise promise) {
        try {
            UsageStatsManager usm = (UsageStatsManager) reactContext.getSystemService(Context.USAGE_STATS_SERVICE);
            long now = System.currentTimeMillis();
            long start = now - 1000 * 60 * 20; // last 20 minutes

            UsageEvents usageEvents = usm.queryEvents(start, now);
            UsageEvents.Event event = new UsageEvents.Event();
            WritableArray eventsArray = Arguments.createArray();

            while (usageEvents.hasNextEvent()) {
                usageEvents.getNextEvent(event);

                if (event.getEventType() == UsageEvents.Event.ACTIVITY_RESUMED || 
                    event.getEventType() == UsageEvents.Event.ACTIVITY_PAUSED || 
                    event.getEventType() == UsageEvents.Event.USER_INTERACTION ) {

                        WritableMap map = Arguments.createMap();
                        map.putString("packageName", event.getPackageName());
                        map.putDouble("timestamp", (double) event.getTimeStamp());
                        map.putInt("eventType", event.getEventType());
                        eventsArray.pushMap(map);
                    }
            }

            promise.resolve(eventsArray);

        } catch (Exception e) {
            promise.reject("ERROR", e);
        }

    }

    @ReactMethod
    public String getForegroundApp () {
        try {
            Process process = Runtime.getRuntime().exec( new String[]{"su", "-c", "dumpsys activity activities | grep mResumedActivity" });

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line;

            while ((line = reader.readLine()) != null) {
                if (line.contains("mResumedActivity") || line.contains("ResumedActivity")) {
                    String[] parts = line.split(" ");

                    for (String part : parts) {
                        if(part.contains("/")) {
                            return part.split("/")[0];
                        }
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return "unknown";
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
        }
    }

    @ReactMethod
    public void startTrackingUsage() {
        handler = new Handler(Looper.getMainLooper());
        runnable = new Runnable() {
            @Override
            public void run() {
                trackCurrentAppUsage();
                handler.postDelayed(this, 15000); // Run every 15 seconds
            }
        };
        handler.post(runnable); // Start immediately
    }

    @ReactMethod
    public void stopTrackingUsage () {
        if(handler != null && runnable != null) {
            handler.removeCallbacks(runnable);
        }
    }

    private void trackCurrentAppUsage() {
        try {
            UsageStatsManager usageStatsManager = (UsageStatsManager) reactContext.getSystemService(Context.USAGE_STATS_SERVICE);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                long currentTime = System.currentTimeMillis();
                long startTime = currentTime - 1000 * 60 * 15; // last 15 minutes

                List<UsageStats> stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, currentTime);

                if (stats != null && !stats.isEmpty()) {
                    UsageStats currentStats = null;

                    for (UsageStats usageStats : stats) {
                        if (currentStats == null || usageStats.getLastTimeUsed() > currentStats.getLastTimeUsed()) {
                            currentStats = usageStats;
                        }
                    }

                    if (currentStats != null) {
                        WritableMap result = Arguments.createMap();
                        result.putString("packageName", currentStats.getPackageName());
                        result.putDouble("timeSpent", currentStats.getTotalTimeInForeground());
                        sendEvent("UsageUpdate", result);
                    }
                }
            }
        } catch (Exception e) {
            WritableMap error = Arguments.createMap();
            error.putString("error", e.getMessage());
            sendEvent("UsageError", error);
        }
    }
}
package com.gaspelapp;

import com.facebook.react.ReactActivity;

import android.content.Intent;
import android.os.Bundle;
import com.emekalites.react.alarm.notification.BundleJSONConverter;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import org.json.JSONObject;
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "GaspelApp";
    }

    @Override
    public void onNewIntent(Intent intent) {
        try {
            Bundle bundle = intent.getExtras();
            JSONObject data = BundleJSONConverter.convertToJSON(bundle);
            getReactInstanceManager().getCurrentReactContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("OnNotificationOpened", data.toString());
        } catch (Exception e){
            System.err.println("Exception when handling notification openned. " + e);
        }
    }
}

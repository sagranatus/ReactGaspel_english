package com.gaspelapp;

import com.facebook.react.ReactActivity;

import android.content.Intent;
import android.os.Bundle;
import com.emekalites.react.alarm.notification.BundleJSONConverter;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import org.json.JSONObject;


import com.aerofs.reactnativeautoupdater.ReactNativeAutoUpdater;
import com.aerofs.reactnativeautoupdater.ReactNativeAutoUpdater.ReactNativeAutoUpdaterUpdateType;
import com.aerofs.reactnativeautoupdater.ReactNativeAutoUpdater.ReactNativeAutoUpdaterFrequency;
import com.aerofs.reactnativeautoupdater.ReactNativeAutoUpdaterActivity;


public class MainActivity extends ReactNativeAutoUpdaterActivity {

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

    	// Add required methods
	/**
	*  URL for the metadata of the update.
	* */
	@Override
	protected String getUpdateMetadataUrl() {
	return "https://www.aerofs.com/u/8691535/update.android.json";
	}
	
	/**
	* Name of the metadata file shipped with the app.
	* This metadata is used to compare the shipped JS code against the updates.
	* */
	@Override
	protected String getMetadataAssetName() {
	return "metadata.android.json";
    }
    
    @Override
	protected ReactNativeAutoUpdaterFrequency getUpdateFrequency() {
	return ReactNativeAutoUpdaterFrequency.DAILY;
    }
    
    @Override
	protected boolean getShowProgress() {
	return false;
	}
}

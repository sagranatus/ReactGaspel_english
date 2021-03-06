package com.yellowpg.gaspel_en;
import android.app.Application;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.os.Build;
import android.graphics.Color;
import android.content.Context;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.rnfs.RNFSPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage; 
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.swmansion.reanimated.ReanimatedPackage;
import java.util.Arrays;
import java.util.List;
import org.pgsqlite.SQLitePluginPackage;
//import com.emekalites.react.alarm.notification.ANPackage;
// Add imports
import com.aerofs.reactnativeautoupdater.ReactNativeAutoUpdaterPackage;
import javax.annotation.Nullable;

// 구글 광고
//import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.admob.RNFirebaseAdMobPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import com.google.android.gms.ads.MobileAds;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return true; //BuildConfig.DEBUG //saea release시에 false로 변경
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new ReactNativePushNotificationPackage(),
            new RNSharePackage(),
            new RNFSPackage(),
            new RNViewShotPackage(),
            new ReactNativeAutoUpdaterPackage(),
            new RNFetchBlobPackage(),
            new ImagePickerPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new SQLitePluginPackage(),
            new ReanimatedPackage(),
            new NetInfoPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAdMobPackage(),
            new RNFirebaseAnalyticsPackage()
           // new ANPackage()
      );
    }

    @Nullable
    @Override
    protected String getBundleAssetName() {
      //  return "main.android.jsbundle";
      return "index.android.bundle";
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  
  };

  @Override
  public String getFileProviderAuthority() {
         return "com.yellowpg.gaspel_en.provider";
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    MobileAds.initialize(this, "ca-app-pub-7847407199304521~7887584025");
    SoLoader.init(this, /* native exopackage */ false);

    String id = "my_channel_id";					// The id of the channel. 
    CharSequence name = "my_channel_name";			// The user-visible name of the channel. 
    String description = "my_channel_description";	// The user-visible description of the channel. 
    if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel mChannel = new NotificationChannel(id, name, NotificationManager.IMPORTANCE_DEFAULT);
 
      // Configure the notification channel.  
      mChannel.setDescription(description);
 
      mChannel.enableLights(true);
      // Sets the notification light color for notifications posted to this 
      // channel, if the device supports this feature.  
      mChannel.setLightColor(Color.RED);
 
      mChannel.enableVibration(true);
      mChannel.setVibrationPattern(new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400});
 
      NotificationManager mNotificationManager = (NotificationManager) this.getSystemService(Context.NOTIFICATION_SERVICE);
      mNotificationManager.createNotificationChannel(mChannel);
    }
  }
}

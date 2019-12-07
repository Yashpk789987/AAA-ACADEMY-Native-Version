package com.yashpk2128;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.io.File;
//import android.support.v4.content.FileProvider;
import android.os.Environment;
import android.os.StrictMode;

public class ToastModule extends ReactContextBaseJavaModule {

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  public ToastModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "ToastExample";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  @ReactMethod
  public void show(String message, int duration) {
    Toast.makeText(getReactApplicationContext(), message, duration).show();
  }

  @ReactMethod
  public boolean openPdf(String path) {
    StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
    StrictMode.setVmPolicy(builder.build());
    String url = "/storage/emulated/0/Android/data/com.yashpk2128/files/"+path;
    // File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getPath()
    //     + File.separator + path);
    File file = new File(url);
    Uri uriFile = Uri.fromFile(file);
    String mimetype = "application/pdf";
    Intent myIntent = new Intent(Intent.ACTION_VIEW);
    myIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    myIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_CLEAR_TOP);
    myIntent.setDataAndType(uriFile, mimetype);

    Intent intentChooser = Intent.createChooser(myIntent, "Choose Pdf Application");
    intentChooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    getReactApplicationContext().startActivity(intentChooser);
    return true;

  }

}
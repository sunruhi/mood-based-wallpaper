import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform) {}

  async ngOnInit() {
    await this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    // Configure status bar
    if (this.platform.is('capacitor')) {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#3880ff' });
      
      // Hide splash screen
      await SplashScreen.hide();

      // Log device info
      const info = await Device.getInfo();
      console.log('Device Info:', info);
    }
  }
}
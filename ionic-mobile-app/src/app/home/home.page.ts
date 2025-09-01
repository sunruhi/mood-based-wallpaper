import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  deviceInfo: any = {};
  networkStatus: any = {};
  location: any = {};
  capturedImage: string | undefined;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    await this.loadDeviceInfo();
    await this.checkNetworkStatus();
  }

  async loadDeviceInfo() {
    try {
      this.deviceInfo = await Device.getInfo();
    } catch (error) {
      console.error('Error getting device info:', error);
    }
  }

  async checkNetworkStatus() {
    try {
      this.networkStatus = await Network.getStatus();
    } catch (error) {
      console.error('Error getting network status:', error);
    }
  }

  async takePicture() {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      this.capturedImage = image.dataUrl;
      
      const toast = await this.toastController.create({
        message: 'Photo captured successfully!',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      console.error('Error taking picture:', error);
      const toast = await this.toastController.create({
        message: 'Failed to capture photo',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

  async getCurrentLocation() {
    const loading = await this.loadingController.create({
      message: 'Getting location...',
      duration: 10000
    });
    await loading.present();

    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
      
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      this.location = {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy
      };

      await loading.dismiss();
      
      const toast = await this.toastController.create({
        message: 'Location retrieved successfully!',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      await loading.dismiss();
      console.error('Error getting location:', error);
      
      const alert = await this.alertController.create({
        header: 'Location Error',
        message: 'Unable to get current location. Please check permissions.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async showDeviceInfo() {
    await Haptics.impact({ style: ImpactStyle.Light });
    
    const alert = await this.alertController.create({
      header: 'Device Information',
      message: `
        <strong>Platform:</strong> ${this.deviceInfo.platform || 'Unknown'}<br>
        <strong>Model:</strong> ${this.deviceInfo.model || 'Unknown'}<br>
        <strong>OS Version:</strong> ${this.deviceInfo.osVersion || 'Unknown'}<br>
        <strong>Manufacturer:</strong> ${this.deviceInfo.manufacturer || 'Unknown'}<br>
        <strong>Network:</strong> ${this.networkStatus.connected ? 'Connected' : 'Disconnected'}<br>
        <strong>Connection Type:</strong> ${this.networkStatus.connectionType || 'Unknown'}
      `,
      buttons: ['Close']
    });
    await alert.present();
  }

  async refreshData() {
    await Haptics.impact({ style: ImpactStyle.Heavy });
    
    const loading = await this.loadingController.create({
      message: 'Refreshing data...',
      duration: 2000
    });
    await loading.present();

    await Promise.all([
      this.loadDeviceInfo(),
      this.checkNetworkStatus()
    ]);

    await loading.dismiss();
    
    const toast = await this.toastController.create({
      message: 'Data refreshed!',
      duration: 1500,
      position: 'bottom',
      color: 'primary'
    });
    await toast.present();
  }
}
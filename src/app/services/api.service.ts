import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import axios from 'axios';
import { ToastController } from '@ionic/angular/standalone';
export interface Game {
  type: string;
  limit: string;
}

export interface Schedule {
  day: string;
  time: string;
  games: Game[];
  description: string;
}

export interface Waitlist {
  firstName: string;
  lastInitial: string;
  phone: string;
  gameType: string;
  smsUpdates: boolean;
  checkedIn: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://clubelite.ca/apis';

  constructor(private toastController: ToastController) {}

  async getSchedule() {
    const response = await axios.get(this.apiUrl + '/schedule');
    return response.data;
  }

  async getWaitlist() {
    const response = await axios.get(this.apiUrl + '/waitlist');
    return response.data;
  }

  async getGalleryItems() {
    const response = await axios.get(this.apiUrl + '/gallery');
    return response.data;
  }

  async checkVerification(phoneNumber: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.apiUrl}/verify/${phoneNumber}`);
      console.log(response);
      return response.data.user;
    } catch (error) {
      console.error('Error checking verification:', error);
      throw error;
    }
  }

  async triggerVerification(phoneNumber: string): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/verify`, { phoneNumber });
    } catch (error) {
      console.error('Error triggering verification:', error);
      throw error;
    }
  }

  async saveUser(userData: any): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/users`, userData);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async addToWaitlist(userData: any): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/waitlist`, userData);
    } catch (error: any) {
      if (error.status === 400) {
        const toast = await this.toastController.create({
          message: 'Phone number already exists',
          duration: 2000,
          position: 'bottom',
        });
        await toast.present();
      }
    }
  }
  async sendOtp(phoneNumber: string): Promise<boolean> {
    console.log(phoneNumber);
    try {
      const response = await axios.post(`${this.apiUrl}/send-otp`, {
        phoneNumber,
      });
      return response.data.success;
    } catch (error: any) {
      return error.data.success;
    }
  }

  async verifyOtp(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiUrl}/verify-otp`, {
        phoneNumber,
        otp,
      });
      return response.data.success;
    } catch (error: any) {
      return error.data.success;
    }
  }
}

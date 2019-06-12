import { Injectable } from '@angular/core';
import { NavOptions, Alert, AlertController, Toast, ToastController, Loading, LoadingController } from 'ionic-angular';
import { FirebaseService } from '../providers/firebase.service';

@Injectable()

// Global service for often-reused functions. Does not extend NavController.
export class GlobalService {

    public loading: Loading;
    public alert: Alert;
    public toast: Toast;

    public forwardTransition: NavOptions;
    public backwardTransition: NavOptions;

    constructor(public firebase: FirebaseService, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
        this.forwardTransition = { animate: true, animation: 'md-transition', direction: 'forward' };
        this.backwardTransition = { animate: true, animation: 'md-transition', direction: 'back' };
    }

    // Indefinite loading screen till dismissed.
    createLoading(message: string): Promise<any> {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        return this.loading.present();
    }

    // Popup alert that can be dismissed.
    createError(message: string): Promise<any> {
        this.alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: message,
            buttons: ['OK']
        });
        return this.alert.present();
    }

    // Resend email verification
    createAlert(message: string): Promise<any> {
        this.alert = this.alertCtrl.create({
            title: 'Unverified Email',
            subTitle: message,
            buttons: ['OK', {
                text: 'Resend verification email',
                handler: () => {
                    this.firebase.sendEmailVerification().then(() => {
                        this.createToast('Email verification sent! Please verify your account before logging in.');
                    });
                }
            }]
        });
        return this.alert.present();
    }

    // Forgot password alert
    createForgotPasswordAlert(): Promise<any> {
        this.alert = this.alertCtrl.create({
            title: 'Forgot Password',
            subTitle: 'Send password reset link to the following email, if account exists:',
            inputs: [{
                name: 'email',
                placeholder: 'Email',
                type: 'email'
            }],
            buttons: [{
                text: 'Send',
                handler: data => {
                    this.firebase.resetPassword(data.email).then(() => {
                        this.createToast('Password reset link sent to your email!');
                    })
                }
            }]
        });
        return this.alert.present();
    }

    createToast(message: string): Promise<any> {
        this.toast = this.toastCtrl.create({
            message: message,
            duration: 7000,
            showCloseButton: true
        })

        this.toast.onDidDismiss(() => {
            console.log('[DEBUG] Toast dismissed.');
        });
        return this.toast.present();
    }

    // DOM hacks to hide the footer whenever the keyboard is shown/hidden.
    keyboardShowHandler(footer: string): void {
        console.log('[DEBUG] Keyboard showing, hiding footer...');
        document.getElementById(footer).style.visibility = 'hidden';
    }

    keyboardHideHandler(footer: string): void {
        console.log('[DEBUG] Keyboard hidden, showing footer again.');
        document.getElementById(footer).style.visibility = 'visible';
    }

    getLocalDate(): string {
        let now = new Date(),
            tzo = -now.getTimezoneOffset(),
            dif = (tzo >= 0) ? '+' : '-',
            pad = (num) => {
                let norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return now.getFullYear()
            + '-' + pad(now.getMonth() + 1)
            + '-' + pad(now.getDate())
            + 'T' + pad(now.getHours())
            + ':' + pad(now.getMinutes())
            + ':' + pad(now.getSeconds())
            + dif + pad(tzo / 60)
            + ':' + pad(tzo % 60);
    }

    getISODate(): string {
        let now = new Date(),
            tzo = 0,
            dif = (tzo >= 0) ? '+' : '-',
            pad = (num) => {
                let norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return now.getFullYear()
            + '-' + pad(now.getMonth() + 1)
            + '-' + pad(now.getDate())
            + 'T' + pad(now.getHours())
            + ':' + pad(now.getMinutes())
            + ':' + pad(now.getSeconds())
            + dif + pad(tzo / 60)
            + ':' + pad(tzo % 60);
    }

    getLocalDateTomorrow(): string {
        let now = new Date(),
            tzo = -now.getTimezoneOffset(),
            dif = (tzo >= 0) ? '+' : '-',
            pad = (num) => {
                let norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return now.getFullYear()
            + '-' + pad(now.getMonth() + 1)
            + '-' + pad(now.getDate() + 1)
            + 'T' + pad(now.getHours())
            + ':' + pad(now.getMinutes())
            + ':' + pad(now.getSeconds())
            + dif + pad(tzo / 60)
            + ':' + pad(tzo % 60);
    }

    getISODateTomorrow(): string {
        let now = new Date(),
            tzo = 0,
            dif = (tzo >= 0) ? '+' : '-',
            pad = (num) => {
                let norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return now.getFullYear()
            + '-' + pad(now.getMonth() + 1)
            + '-' + pad(now.getDate() + 1)
            + 'T' + pad(now.getHours())
            + ':' + pad(now.getMinutes())
            + ':' + pad(now.getSeconds())
            + dif + pad(tzo / 60)
            + ':' + pad(tzo % 60);
    }

    // Modifies an ISO date by minutes.
    modifyISO(localDate: string, modifier?: number): string {
        let time = new Date(Date.parse(localDate) + (modifier * 60000)),
            tzo = -time.getTimezoneOffset(),
            dif = (tzo >= 0) ? '+' : '-',
            pad = (num) => {
                let norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return time.getFullYear()
            + '-' + pad(time.getMonth() + 1)
            + '-' + pad(time.getDate())
            + 'T' + pad(time.getHours())
            + ':' + pad(time.getMinutes())
            + ':' + pad(time.getSeconds())
            + dif + pad(tzo / 60)
            + ':' + pad(tzo % 60);
    }
}

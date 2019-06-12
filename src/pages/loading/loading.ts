import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs/Rx';
import { FirebaseService } from '../../providers/firebase.service';
import { GlobalService } from '../../providers/global.service';

import { TabsPage } from '../home/home';
import { LandingPage } from '../landing/landing';

@Component({
    selector: 'page-loading',
    templateUrl: 'loading.html'
})

export class LoadingPage {
    public email: any;
    public password: any;

    public cycleCount: number = 0;
    public messageBank: string[] = ['Loading Hive Up...',
        'Retrieving your Statements...',
        'Doing some Math...',
        'Reticulating Splines...',
        'Preparing your Profile...',
        'Setting goals...'];
    public message: string = '';
    public refresher: Subscription;

    public _checkCompanyTerms: () => void;

    // Using TypeScript, we inject dependencies by specifying type.
    constructor(public nav: NavController,
        public alert: AlertController,
        public global: GlobalService,
        public firebase: FirebaseService,
        private platform: Platform) {
        this.message = this.messageBank[Math.floor(Math.random() * this.messageBank.length)];
        let observe = Observable.interval(6000).map((rand) => Math.floor(Math.random() * this.messageBank.length));
        this.refresher = observe.subscribe((rand) => {
            this.message = this.messageBank[rand];
            this.cycleCount++;
        });
    }

    // Autologin and loading data from Firebase. 
    // Comment out this function to freeze the loading screen (to perform CSS changes).
    ionViewDidLoad(): void {
        // let latestVersion: string;
        // this.firebase.af.database.object('/version').take(1).subscribe(
        //     (data) => latestVersion = data.$value,
        //     (err: Error) => console.log(err.message),
        //     () => {
        //         if (latestVersion > this.firebase.version) {
        //             let alert =  this.alert.create({
        //                 title: 'Version Update',
        //                 subTitle: 'New version detected: ' + latestVersion + '.<br>Please update your app from the App Store!',
        //                 enableBackdropDismiss: false,
        //                 buttons: [
        //                     {
        //                         text: 'OK',
        //                         handler: () => {
        //                             this.platform.exitApp();
        //                         }
        //                     }
        //                 ]
        //             });
        //             alert.present();
        //         }
        //         else if (latestVersion <= this.firebase.version) {
        //             this.attemptLogin();
        //         }
        //     }
        // );

        this.attemptLogin();
    }

    ionViewWillLeave(): void {
        this.refresher.unsubscribe();
    }

    attemptLogin(): void {
        const authObserver = this.firebase.af.auth.subscribe(user => {
            if (user) {
                this.firebase.uid = user.uid;
                this.firebase.getProfile().then(() => {
                    this.firebase.getAccounts().then(() => {
                        //enable live-reload of policies from the database.
                        this.firebase.getPolicies();
                        this.nav.setRoot(TabsPage, null, this.global.forwardTransition);
                        authObserver.unsubscribe();
                    });
                });
            }
            else {
                this.nav.setRoot(LandingPage, null, this.global.forwardTransition);
                authObserver.unsubscribe();
            }
        });
    }

    logout(): void {
        this.firebase.logout();

        // Use setPages to remove all pages except one.
        this.nav.setPages([{ page: LandingPage }]);
    }

}

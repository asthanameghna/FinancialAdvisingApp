import { Component, ViewChild } from '@angular/core';
import { App, NavController, Platform, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FirebaseService } from '../../providers/firebase.service';
import { GlobalService } from '../../providers/global.service';
import { InsuranceStatement } from '../../providers/variables';
import { FamilyMember } from '../../providers/variables';

import { TabsPage } from '../home/home';

import 'rxjs/add/operator/take'

@Component({
    selector: 'page-landing',
    templateUrl: 'landing.html'
})

export class LandingPage {
    tabBarElement: any;
    @ViewChild('emailField') emailField: any;

    private _keyboardShow: () => void;
    private _keyboardHide: () => void;

    public formType: string;
    public passwordFieldType: string;
    public peekIcon: string;
    public sampleInsuranceStatement: InsuranceStatement;
    public me: FamilyMember;

    public input = {email: '', password: '', name: '', age: null, occupation: ''};

    constructor(public nav: NavController,
                public navParams: NavParams,
                public global: GlobalService,
                public firebase: FirebaseService,
                public storage: Storage,
                public platform: Platform,
                public app: App){
        if (!this.navParams.get('formType')) {
            this.formType =  'login';
        } else {
            this.formType = this.navParams.get('formType');
        }
        this.passwordFieldType = 'password';
        this.peekIcon = 'ios-eye';
        this._keyboardShow = () => {this.global.keyboardShowHandler('loginFooter')};
        this._keyboardHide = () => {this.global.keyboardHideHandler('loginFooter')};
        this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    }

    ionViewDidEnter(): void {
        // Use anonymous function to pass a variable to the callback function.
        window.addEventListener('native.keyboardshow', this._keyboardShow);
        window.addEventListener('native.keyboardhide', this._keyboardHide);
        
    }
    ionViewWillEnter() {
        this.tabBarElement.style.display = 'none';
    }

    ionViewDidLeave(): void {
        window.removeEventListener('native.keyboardshow', this._keyboardShow);
        window.removeEventListener('native.keyboardhide', this._keyboardHide);
        this.tabBarElement.style.display = '';
    }

    togglePasswordHide(): void {
        if (this.passwordFieldType === 'password') {
            this.passwordFieldType = 'text';
            this.peekIcon = 'ios-eye-outline';
        }

        else if (this.passwordFieldType === 'text') {
            this.passwordFieldType = 'password';
            this.peekIcon = 'ios-eye';
        }
    }

    submitForm(): void {
        switch (this.formType) {
            case 'login':
                this.attemptLogin();
                break;
            case 'signup':
                this.submitSignup();
                break;
        }
    }

    forgotPassword(): void {
      this.global.createForgotPasswordAlert();
    }

    // Login function returns a promise, so the 'then' method is available.
    attemptLogin(): void {
        if (this.global.toast) {
            this.global.toast.dismiss().then(() => {
                this.global.createLoading('Logging in...');
            });
        }
        else {
            this.global.createLoading('Logging in...');
        }
        this.firebase.af.auth.login({ email: this.input.email, password: this.input.password }).then(
            (data) =>
            {
                if(this.firebase.isEmailVerified()) {
                  console.log('[DEBUG] Login success with credentials. UID: ' + data.uid);
                  this.loginSuccess(data.uid);
                }
                else {
                  this.global.loading.dismiss().then(() => {
                      this.global.createAlert("Please activate your account before logging in");
                  });
                }
            },
            (err: any) =>
            {
                this.global.loading.dismiss().then(() => {
                    this.global.createToast(err.message);
                });
            }
        );
    }

    loginSuccess(uid: string): void {
        this.firebase.uid = uid;
        this.storage.set('autologin', true);

        this.firebase.getProfile().then(() => {
            this.firebase.getAccounts().then(() => {
                this.firebase.getPolicies();
                this.navHomeTabs();
            });
        });
    }

    submitSignup(): void {
        if (this.global.toast) {
            this.global.toast.dismiss().then(() => {
                this.global.createLoading('Signing up...');
            });
        }
        else {
            this.global.createLoading('Signing up...');
        }

        this.firebase.af.auth.createUser({email: this.input.email, password: this.input.password}).then(
            (data) => {
                console.log('[DEBUG] Signup success with credentials. UID: ' + data.uid);
                this.signupSuccess(data.uid);
            },
            (err: any) =>
            {
                console.log(err);
                this.global.loading.dismiss().then(() => {
                    /*
                    if (err.code === 'auth/user-not-found')
                        this.global.createToast('Error: Your email does not exist in the database.');
                    else if (err.code === 'auth/email-already-in-use')
                        this.global.createToast('You have already signed up! Please log in instead.'); */
                    this.global.createToast(err.message);
                });
            }
        );
    }

    signupSuccess(uid: string): void {
        //this.firebase.uid = uid;
        //this.storage.set('autologin', true);

        this.firebase.profile = {email: this.input.email,
                                 name: this.input.name,
                                 age: this.input.age,
                                 occupation: this.input.occupation,
                                 phone: '',
                                 employment: '',
                                 timeframe: '',
                                 picture:'',
                                 advisorRequested: false,
                                 portfolioType: false,
                                 interests: {insurance: false, savingsinvestments: false},
                                 timeOfCreation: Date.now(),
                                 isAdmin: false
                                };
        let profiles = this.firebase.af.database.object('/users/' + uid);
        profiles.update(this.firebase.profile);
        this.firebase.sendEmailVerification().then(() => {
          this.global.createToast('Email verification sent! Please verify your account before logging in.');
          this.global.loading.dismiss();
        });
        /*this.firebase.getProfile().then(() => {
            this.firebase.getAccounts().then(() => {
                this.navHomeTabs();
            });
        });*/
        
        //create sample policy
        this.sampleInsuranceStatement = new InsuranceStatement(null, null, 'Sample Policy', 'Myself', 'Myself', 100, 'GIRO', 'AIA', 'Advisor', 12345, 'policy number', 'Annually', '02 Mar 2017', '01 Mar 2018', 'additional notes', '', '', '', '', '', '', null, '', null, []);
        var insuranceRef = this.firebase.af.database.list('/accounts/' + uid + '/insurance/');
         insuranceRef.push(this.sampleInsuranceStatement);

        //create first "FamilyMember"
        this.me = new FamilyMember(this.input.name,this.input.age,'',this.input.occupation,'','');
        var familyMemberRef = this.firebase.af.database.list('/accounts/' + uid + '/familymembers/');
        familyMemberRef.push(this.me);
    }

    navHomeTabs(): void {
        this.global.loading.dismiss();
        //this.nav.setRoot(TabsPage, {index: "0"}, this.global.forwardTransition);
        this.app.getRootNav().setRoot(TabsPage);
    }
}

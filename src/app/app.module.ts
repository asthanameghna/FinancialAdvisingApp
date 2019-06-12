import { NgModule, ErrorHandler } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HiveupApp } from './app.component';
import { Push } from '@ionic-native/push';


import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import { ChartsModule } from 'ng2-charts';

import { ProgressBarComponent } from '../components/progress-bar/progress-bar';

//pages
import { LoadingPage } from '../pages/loading/loading';
import { LandingPage } from '../pages/landing/landing';
import { TabsPage } from '../pages/home/home';

import { AddStatmentPage } from '../pages/addstatement/addstatement';
import { AddInsurancePage } from '../pages/add-insurance/add-insurance';
import { EditInsurancePage } from '../pages/edit-insurance/edit-insurance';
import { AddCoveragePage } from '../pages/add-coverage/add-coverage';
import { IntroPage } from '../pages/intro/intro';
import { PolicyDetailsPage } from '../pages/policy-details/policy-details';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ClaimPage } from '../pages/claim/claim';
import { ClaimDetailsPage } from '../pages/claim-details/claim-details';
import { InsuranceModal } from '../pages/insurance/insurance';
import { SettingsPage } from '../pages/settings/settings';
import { NotificationPage } from '../pages/notifications/notifications';
import { ProfilePage } from '../pages/profile/profile';
import { BasicInfoPage } from '../pages/basic-info/basic-info';
import { EditProfilePage } from "../pages/edit-profile/edit-profile";
import { TncPage } from "../pages/tnc/tnc";
import { PrivacyPolicyPage } from "../pages/privacy-policy/privacy-policy";
import { ChangeEmailPage } from "../pages/change-email/change-email";
import { ChangePasswordPage } from "../pages/change-password/change-password";
import { ContactSupportPage } from '../pages/contact-support/contact-support';
import { PhotoPage } from "../pages/photo/photo";
import { FamilyMemberPage } from "../pages/family-members/family-members";
import { SpeakToAdvisorPage } from '../pages/speak-to-advisor/speak-to-advisor';
import { ReferMyAdvisorPage } from '../pages/refer-my-advisor/refer-my-advisor';
import { ContentsPage } from '../pages/contents/contents';
import { EditClaimDetailsPage } from '../pages/edit-claim-details/edit-claim-details';

//services
import { FirebaseService } from '../providers/firebase.service';
import { GlobalService } from '../providers/global.service';

//pipe
import { DatePipe } from '@angular/common';
import { ObjectKeysPipe } from '../pipes/objectkeys.pipe';
import { SafeNumberPipe } from '../pipes/safeNumbers.pipe';
import { ReversePipe } from '../pipes/reverse.pipe';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { PictureNotificationPage } from "../pages/picture-notification/picture-notification";
import { EmailComposer } from 'ionic-native';



export const ionicConfig: any = {
    tabsHideOnSubPages: true,
    scrollAssist: false,
    autoFocusAssist: false,
    backButtonText: '',
    platforms: {
        android: {

        },
        ios: {
            statusbarPadding: true,
        }
    }
}

// For testing.
export const firebaseConfigTest = {
    apiKey: 'AIzaSyCitc7rzaiR82zJ56OrqxREZwORi_303yY',
    authDomain: "hiveup-test.firebaseapp.com",
    databaseURL: "https://hiveup-test.firebaseio.com",
    storageBucket: "hiveup-test.appspot.com"
};

// For live deployment.
export const firebaseConfigLive = {
    apiKey: 'AIzaSyC4LIBpOESuSIDFN8hDT_6OffjH16c-4gc',
    authDomain: "hiveup-proto.firebaseapp.com",
    databaseURL: "https://hiveup-proto.firebaseio.com",
    storageBucket: "hiveup-proto.appspot.com"
};

export const firebaseAuthConfig = {
    provider: AuthProviders.Password,
    method: AuthMethods.Password
}

@NgModule({
    declarations: [
        HiveupApp,
        ProgressBarComponent,
        LoadingPage,
        LandingPage,
        TabsPage,
        AddStatmentPage,
        AddInsurancePage,
        EditInsurancePage,
        AddCoveragePage,
        IntroPage,
        PolicyDetailsPage,
        DashboardPage,
        ClaimPage,
        ClaimDetailsPage,
        InsuranceModal,
        SettingsPage,
        ProfilePage,
        BasicInfoPage,
        EditProfilePage,
        PrivacyPolicyPage,
        TncPage,
        ChangeEmailPage,
        ChangePasswordPage,
        PhotoPage,
        NotificationPage,
        PictureNotificationPage,
        FamilyMemberPage,
        ContactSupportPage,
        SpeakToAdvisorPage,
        ReferMyAdvisorPage,
        ContentsPage,
        EditClaimDetailsPage,

        SafeNumberPipe,
        ObjectKeysPipe,
        ReversePipe
    ],
    imports: [
        IonicModule.forRoot(HiveupApp, ionicConfig),
        IonicStorageModule.forRoot(),
        AngularFireModule.initializeApp(firebaseConfigLive, firebaseAuthConfig),
        ChartsModule,
        IonicImageViewerModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        HiveupApp,
        LoadingPage,
        LandingPage,
        TabsPage,
        AddStatmentPage,
        AddInsurancePage,
        EditInsurancePage,
        AddCoveragePage,
        IntroPage,
        PolicyDetailsPage,
        DashboardPage,
        ClaimPage,
        ClaimDetailsPage,
        InsuranceModal,
        SettingsPage,
        ProfilePage,
        BasicInfoPage,
        EditProfilePage,
        PrivacyPolicyPage,
        TncPage,
        ChangeEmailPage,
        ChangePasswordPage,
        PhotoPage,
        NotificationPage,
        PictureNotificationPage,
        FamilyMemberPage,
        ContactSupportPage,
        SpeakToAdvisorPage,
        ReferMyAdvisorPage,
        ContentsPage,
        EditClaimDetailsPage
        
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        DecimalPipe,
        DatePipe,
        ObjectKeysPipe,
        ReversePipe,
        FirebaseService,
        GlobalService,
        Push, 
        EmailComposer
    ]
})
export class AppModule {}

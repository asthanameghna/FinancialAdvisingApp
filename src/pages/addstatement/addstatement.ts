import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform, ModalController, NavController, NavParams, AlertController, ActionSheetController, Events, ViewController } from 'ionic-angular';

import { GlobalService } from '../../providers/global.service';
import { FirebaseService } from '../../providers/firebase.service';
import firebase from 'firebase';

import { Statement, BrokerStatement, BankStatement, InsuranceStatement, Notification } from '../../providers/variables';
import { PhotoPage } from "../photo/photo";
import { AddInsurancePage } from '../add-insurance/add-insurance';
import { ReferMyAdvisorPage } from '../refer-my-advisor/refer-my-advisor';
import { TabsPage } from '../home/home';
import { Camera, ImagePicker, File } from 'ionic-native';
import { EmailComposer } from 'ionic-native';

declare var cordova: any;

@Component({
    selector: 'page-addstatement',
    templateUrl: 'addstatement.html'
})

export class AddStatmentPage {

    public images: string[] = [];

    public selectedIndex: number;

    public statement: Statement = new Statement(this.firebase.uid, this.firebase.profile.email, '', [], undefined, null);

    public uploadToggle: boolean = false;
    public uploadTitle: string = '';
    public uploadProgressPercentage: number = 0;

    public uploadIndex: number;
    public uploadExisting: number;
    public uploadProgress: number;
    public uploadTotal: number;

    public notification: Notification = new Notification('','picture','',0,'',[]);

    constructor(public platform: Platform,
        public nav: NavController,
        public navparams: NavParams,
        public alert: AlertController,
        public actionsheetCtrl: ActionSheetController,
        public modalCtrl: ModalController,
        public global: GlobalService,
        public firebase: FirebaseService,
        public events: Events,
        public view: ViewController) {
           
            this.statement.details = new InsuranceStatement(undefined, undefined, '', '', '', 0, '', '', '', null, '', undefined, '', '', '', '', '', '', '', '', '', null, '', null, []);
            this.statement.type = '2';

            this.selectedIndex = 0;

            this.events.subscribe('addPolicy', selectedValue => {
                this.invokeActionSheet();
            })
        }

        ionViewDidEnter(): void {
            if(this.images.length === 0) {
                this.invokeActionSheet();
            }
        }

        openManualModal() {
            let modal = this.modalCtrl.create(AddInsurancePage);
            modal.present();
        }
    
        openReferMyAdvisorModal() {
            let modal = this.modalCtrl.create(ReferMyAdvisorPage);
            modal.present();
        }

        openPhotoModal() {
            let modal = this.modalCtrl.create(PhotoPage);
            modal.onDidDismiss(data =>  {
                this.images = data;
            });
            modal.present();
        }

        sendPolicyByEmail() {
            //this.copyEmailToClipboard();
            var address = 'mailto:policy@hive-up.com?subject=Upload policy via Email';
            location.href = (address);
        }

        dismiss() {
            this.view.dismiss();
        }

        checkItem(): boolean {
            if (this.statement.type && this.images.length > 0)
                return true;
            else
                return false;
        }

        clearFields(): void {
            this.statement = new Statement(this.firebase.uid, this.firebase.profile.email, '', [], undefined, null);
            this.images = [];
        }

        generateNotification(){
            this.notification.message = 'Policy pictures have been uploaded.',
            this.notification.timestamp = Date.now();
            this.notification.type = 'picture';
            this.notification.uid = this.firebase.uid;
            this.notification.photos = this.statement.photos;
            var notificationListRef = this.firebase.af.database.list('/notifications');
            notificationListRef.push(this.notification);
        }

        resetForm(): void {
            this.uploadToggle = false;
            this.uploadIndex = 0
            this.uploadProgress = 0;
            this.uploadExisting = 0;
            this.uploadTotal = 0;
            this.uploadProgressPercentage = 0;
            this.uploadTitle = '';
            this.clearFields();
    
            this.global.createToast('Your statement was successfully uploaded. We\'ll update your information within 24 hours.').then(() => {
                //navigate to dashboard
                this.nav.push(TabsPage ,{index: "0"});
            });
        }

        invokeActionSheet() {
            let actionsheet = this.actionsheetCtrl.create({
                title: 'How would you like to add your policy?',
                buttons: [
                    // {
                    //     text: 'Upload/Take photo',
                    //     handler: () => {
                    //         //this.selectPhotoSource();
                    //         this.openPhotoModal();
                    //     }
                    // },    
                    {
                        text: 'Add manually',
                        handler: () => {
                            this.openManualModal();
                        }
                    },
                    {
                        text: 'Send via Email',
    
                        handler: () => {
                            this.sendPolicyByEmail();
                            //this.copyEmailToClipboard();
                        }
                    },   
                    {
                        text: 'Refer Advisor',
                        handler: () => {
                            this.openReferMyAdvisorModal();
                        }
                    },              
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log("cancel clicked in actionsheet.");
                        }
                    }
                ]
            });
            actionsheet.present();
        }

        // Calls the cordova camera plugin to take a picture from the camera.
        addPhoto(): any {
        const cameraOptions: any = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true,
            saveToPhotoAlbum: false,
            cameraDirection: Camera.Direction.BACK
        };

        Camera.getPicture(cameraOptions).then((imageData) => {
            this.images.push(imageData);
            this.selectedIndex = this.images.length - 1;
            document.getElementById('uploadNavbar').click();
            //this.images = imageData
        }, (err) => {
            console.log('[DEBUG] ' + err);
        });
    }

        // Update item with information filled in. Numbers have to be cast from string.
        uploadStatement(): void {
        //check number of photo.
        if (this.images.length > 5) {
            this.global.createToast('Sorry! You can only include 5 images for this statement.');
        }
        else {
            this.statement.timestamp = Date.now();

            let check = this.checkItem();
            if (!check) {
                this.global.createError('Sorry! You do not have an item for submission!');
            }
            else {
                this.uploadToggle = true;
                this.uploadTitle = 'Uploading statement...';
                this.uploadProgressPercentage = 0;
                if (this.platform.is('ios') || this.platform.is('android')) {
                    let statements = this.firebase.af.database.list('/statements/');
                    statements.push(this.statement).then(
                        (report) => {
                            let statementId = report.key;

                            this.uploadIndex = 0

                            this.uploadProgress = 0;
                            this.uploadExisting = 0;
                            this.uploadTotal = this.images.length;

                            this.uploadPictures(statementId);
                        },
                        (err: Error) => console.log(err.message)
                    );
                }
            }
        }    
    }

    uploadPicture(statementId: string, imageUrl: string): Promise<any> {
        let directory, fileName;

        // Cases for different filesystems; camera vs gallery
        return new Promise((resolve, reject) => {
            File.resolveLocalFilesystemUrl(imageUrl).then(
                (fileEntry) => {
                    if (this.platform.is('ios')) {
                        directory = cordova.file.tempDirectory;
                        fileName = fileEntry.name;
                    }
                    else if (this.platform.is('android')) {
                        if (fileEntry.filesystem.name === 'cache')
                            directory = cordova.file.cacheDirectory;
                        else if (fileEntry.filesystem.name === 'cache-external')
                            directory = cordova.file.externalCacheDirectory;
                        fileName = fileEntry.name;
                    }
                    let photoMeta = { contentType: 'image/jpeg' };
                    let storagePhotoRef = firebase.storage().ref().child('statements/' + this.firebase.uid + '/' + statementId + '/' + (this.uploadIndex + 1).toString() + '.jpg');
                    File.readAsArrayBuffer(directory, fileName).then(
                        (data) => {

                            let imageBlob = new Blob([data], { type: 'image/jpeg' });
                            storagePhotoRef.put(imageBlob, photoMeta).then((data) => {
                                this.statement.photos.push(data.downloadURL);
                                
                                setInterval(this.runningVariable(), 3000);
                                //this.uploadProgressPercentage = +((this.uploadProgress / this.uploadTotal).toFixed(2)) * 100;
                                resolve();
                            })
                        },
                        (err) => {
                            console.log(err.message);
                            reject();
                        }
                    );
                },
                (err) => {
                    console.log(err);
                    reject();
                }
            );
        });
    }

    uploadPictures(statementId: string): any {
        this.uploadTitle = 'Uploading pictures...';
        if (this.uploadIndex < this.images.length) {
            this.uploadPicture(statementId, this.images[this.uploadIndex]).then(
                () => {
                    this.uploadIndex++;
                    this.uploadPictures(statementId);
                }
            )
        }
        else if (this.uploadIndex === this.images.length) {
            this.finishedUploading(statementId);
        }
    }

    runningVariable() {
        this.uploadProgress++;
        var temp = this.uploadProgressPercentage;
        var i = +((this.uploadProgress / this.uploadTotal).toFixed(2)) * 100;
        for (var j = temp; j < i; j++) {
            this.uploadProgressPercentage++;
        }
    }

    finishedUploading(uid: string): any {
        let statement = this.firebase.af.database.object('/statements/' + uid);
        statement.update(this.statement).then(
            (data) => {
                this.generateNotification();
                this.clearFields();
                this.resetForm();
                
            },
            (err: Error) => console.log(err.message)
        );
    }
}
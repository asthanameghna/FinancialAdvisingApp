import { Component } from '@angular/core';
import { Platform, NavController, NavParams, ViewController, ActionSheetController, AlertController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase.service';
import { GlobalService } from '../../providers/global.service';
import { Storage } from '@ionic/storage';
import { Profile, Notification } from '../../providers/variables';
//import { Camera, ImagePicker, File } from 'ionic-native';
declare var cordova: any;

@Component({
	selector: 'page-edit-profile',
	templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
    public names: any = {newname: ''};
  //  public numbers: any = {newnumber: ''};
  //  public occupations: any = {newoccupation:''};
  //  public newpicture: string;
  public profile: Profile = new Profile ('','',0,'','','','','',null, 0, false,null,false);
    public notification: Notification = new Notification('','profile','',0,'',[]);

    constructor(public platform: Platform,
                public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public global: GlobalService, 
                public firebase: FirebaseService,
                public storage: Storage,
                public actionsheetCtrl: ActionSheetController,
                public alert: AlertController) {

    }

    ionViewDidLoad() {
		this.populateData();
		
		console.log('ionViewDidLoad EditProfilePage');
	}


    
    /**
     * populateData() acquires relevant information from profile and seeds it into the input form
     * 
     * 
     * @memberOf EditProfilePage
     */
    populateData(){
        this.profile = this.firebase.profile;
       /* this.names.newname = this.profile.name;
        this.numbers.newnumber = this.profile.phone;
        this.occupations.newoccupation = this.profile.occupation;
        this.newpicture = this.profile.picture;*/
    }


    /**
     * 
     * updateProfile() only updates details if they have been changed 
     * 
     * @memberOf EditProfilePage
     */
    updateProfile(){
        this.global.createLoading('Just a sec...');

        /* The following statements update the changed fields*/
        /*Association should work too but this is just for extra measure*/
        
    /*  if (this.names.newname !== ''){
          this.profile.name = this.names.newname;
        }
        if (this.numbers.newnumber !== ''){
            this.profile.phone = this.numbers.newnumber;
        }
        if (this.occupations.newoccupation !== ''){
            this.profile.occupation = this.occupations.newoccupation;
        }*/

        var profileRef = this.firebase.af.database.object('/users/' + this.firebase.uid);
        profileRef.update(this.profile).then(
                (data) => {
                    this.profile = new Profile ('','',0,'','','','','',null, 0, false,null,false);
                this.generateNotification();
            },
            (err: Error) => console.log(err.message)
            );
        
        /*Once update has been completed*/
        this.global.loading.dismiss().then(() => {
            this.global.createToast('Profile Successfully Updated!');
        });
        this.returntoprofile();
}
    
    /**
     * The following funtions allow HiveUp to acquire the profile picture of the user
     * These functions are inactive for now until the utility of a profile picture is decided on..
     * @memberOf EditProfilePage
     */
    /*
    selectPhotoSource(): void {
        let alert = this.alert.create({
            message: 'Where you would like to get your picture from?',
            buttons: [{
                text: 'Camera',
                handler: () => {
                    console.log('[DEBUG] Take picture from camera.');
                    alert.dismiss().then(() => {
                        this.addPhoto();
                    });
                }
            },
            {
                text: 'Gallery',
                cssClass: 'nobold',
                handler: () => {
                    console.log('[DEBUG] Retrieve picture from gallery.');
                    alert.dismiss().then(() => {
                        this.choosePhoto();
                    });
                }
            }
            ]
        });

        alert.present();
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
           // this.profile.picture = imageData;
            this.updatePicture(imageData);
            this.updateProfile();
            document.getElementById('uploadNavbar').click();
        }, (err) => {
            console.log('[DEBUG] ' + err);
        });
    }

    // Calls the image picker plugin to take a picture from the gallery.
    choosePhoto(): void {
        const galleryOptions: any = {
            outputType: 0,   // File URI
            width: 0,
            height: 1200
        }

        ImagePicker.getPictures(galleryOptions).then(
            (imageData) => {
                imageData.forEach((image) => {
                  //  this.profile.picture = imageData;
                    this.updatePicture(imageData);
                    this.updateProfile();
                });
                document.getElementById('uploadNavbar').click();
                
            },
            (err) => {
                console.log('[DEBUG] ' + err);
            }
        );
    }

     updatePicture(imageUrl: string): Promise<any> {
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
                    let storagePhotoRef = firebase.storage().ref().child('profilepics/' + this.firebase.uid + '/' + 'profile picture.jpg'); 
                    File.readAsArrayBuffer(directory, fileName).then(
                        (data) => {

                            let imageBlob = new Blob([data], { type: 'image/jpeg' });
                            storagePhotoRef.put(imageBlob, photoMeta).then((data) => {
                                this.profile.picture = data.downloadURL;
                                
                                //setInterval(this.runningVariable(), 3000);
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

*/

    generateNotification(){
        this.notification.message = 'Your profile has been updated.';
        this.notification.timestamp = Date.now();
        this.notification.type = 'profile';
        this.notification.uid = this.firebase.uid;
        var notificationListRef = this.firebase.af.database.list('/notifications');
        notificationListRef.push(this.notification);
    }

    returntoprofile(){
        this.view.dismiss();
    }
}

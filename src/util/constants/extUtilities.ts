export class extUtilities {

    public static readonly BOOTSTRAP_COLORS: Array<{ id: number, name: string, class: string, hexColor: string }> =
        [
            { id: 1, name: 'primary', class: 'bg-primary', hexColor: '#007BFF;' },
            { id: 2, name: 'warning', class: 'bg-warning', hexColor: '#FFC107;' },
            { id: 3, name: 'success', class: 'bg-success', hexColor: '#28A745;' },
            { id: 4, name: 'danger', class: 'bg-danger', hexColor: '#DC3545;' },
            { id: 5, name: 'dark', class: 'bg-dark', hexColor: '#343A40;' },
            { id: 6, name: 'maroon', class: 'bg-maroon', hexColor: '#D81B60;' },
            { id: 7, name: 'orange', class: 'bg-orange', hexColor: '#FD7E14;' },
            { id: 8, name: 'lime', class: 'bg-lime', hexColor: '#01FF70;' },
            { id: 9, name: 'teal', class: 'bg-teal', hexColor: '#20C997;' },
            { id: 10, name: 'olive', class: 'bg-olive', hexColor: '#3D9970;' },
            { id: 11, name: 'indigo', class: 'bg-indigo', hexColor: '#6610F2;' },
            { id: 12, name: 'info', class: 'bg-info', hexColor: '#17A2B8;' },
            { id: 13, name: 'pink', class: 'bg-pink', hexColor: '#E83E8C;' },
            { id: 14, name: 'navy', class: 'bg-navy', hexColor: '#001F3F;' },
            { id: 15, name: 'purple', class: 'bg-purple', hexColor: '#6F42C1;' },
            { id: 16, name: 'fuchsia', class: 'bg-fuchsia', hexColor: '#F012BE;' },
            { id: 17, name: 'secondary', class: 'bg-secondary', hexColor: '#6C757D;'},
            { id: 18, name: 'wine', class: 'bg-wine', hexColor:'#5D0210;'}
        ];

        public static getBootstrapColor(color):any{
            let obj=null;
            extUtilities.BOOTSTRAP_COLORS.forEach(element=>{
                if(Number.isNaN(parseInt(color))){
                    if(element.name==color)obj=element;
                }else{
                    if(element.id==parseInt(color))obj=element
                }
            });
            return obj;
        }

    public static readonly MATERIAL_ICONS: Array<{ id: number, icon: string, selected:boolean }> =
        [
            { id: 1, icon: 'settings', selected:false },
            { id: 2, icon: 'account_circle' , selected:false},
            { id: 3, icon: 'add_task' , selected:false},
            { id: 4, icon: 'admin_panel_settings' , selected:false},
            { id: 5, icon: 'alarm' , selected:false},
            { id: 6, icon: 'announcement' , selected:false},
            { id: 7, icon: 'book_online' , selected:false},
            { id: 8, icon: 'build_circle' , selected:false},
            { id: 9, icon: 'calendar_today' , selected:false},
            { id: 10, icon: 'camera_enhance' , selected:false},
            { id: 11, icon: 'card_travel' , selected:false},
            { id: 12, icon: 'check_circle' , selected:false},
            { id: 13, icon: 'circle_notifications' , selected:false},
            { id: 14, icon: 'commute' , selected:false},
            { id: 15, icon: 'credit_card' , selected:false},
            { id: 16, icon: 'delete_forever' , selected:false},
            { id: 17, icon: 'description' , selected:false},
            { id: 18, icon: 'favorite' , selected:false},
            { id: 19, icon: 'face' , selected:false},
            { id: 20, icon: 'file_present' , selected:false},
            { id: 21, icon: 'flight_land' , selected:false},
            { id: 22, icon: 'flight_takeoff' , selected:false},
            { id: 23, icon: 'grading' , selected:false},
            { id: 24, icon: 'help_center' , selected:false},
            { id: 25, icon: 'home' , selected:false},
            { id: 26, icon: 'https' , selected:false},
            { id: 27, icon: 'important_devices' , selected:false},
            { id: 28, icon: 'language' , selected:false},
            { id: 29, icon: 'leaderboard' , selected:false},
            { id: 30, icon: 'lightbulb' , selected:false},
            { id: 31, icon: 'manage_accounts' , selected:false},
            { id: 32, icon: 'offline_bolt' , selected:false},
            { id: 33, icon: 'pending_actions' , selected:false},
            { id: 34, icon: 'payment' , selected:false},
            { id: 35, icon: 'perm_phone_msg' , selected:false},
            { id: 36, icon: 'print' , selected:false},
            { id: 37, icon: 'report_problem' , selected:false},
            { id: 38, icon: 'schedule_send' , selected:false},
            { id: 39, icon: 'settings_cell' , selected:false},
            { id: 40, icon: 'store' , selected:false},
            { id: 41, icon: 'today' , selected:false},
            { id: 42, icon: 'work' , selected:false},
            { id: 43, icon: 'visibility' , selected:false},
            { id: 44, icon: 'videocam' , selected:false},
            { id: 45, icon: 'location_on' , selected:false},
            { id: 46, icon: 'email' , selected:false},
            { id: 47, icon: 'forward_to_inbox' , selected:false},
            { id: 48, icon: 'phonelink_setup' , selected:false},
            { id: 49, icon: 'person_search' , selected:false},
            { id: 50, icon: 'textsms' , selected:false},
            { id: 51, icon: 'vpn_key' , selected:false},
            { id: 52, icon: 'archive' , selected:false},
            { id: 53, icon: 'add' , selected:false},
            { id: 54, icon: 'content_cut' , selected:false},
            { id: 55, icon: 'content_paste' , selected:false},
            { id: 56, icon: 'create' , selected:false},
            { id: 57, icon: 'flag' , selected:false},
            { id: 58, icon: 'inbox' , selected:false},
            { id: 59, icon: 'report' , selected:false},
            { id: 60, icon: 'unarchive' , selected:false},
            { id: 61, icon: 'where_to_vote' , selected:false},
            { id: 62, icon: 'shield' , selected:false},
            { id: 63, icon: 'airplanemode_inactive', selected:false },
            { id: 64, icon: 'bluetooth_drive' , selected:false},
            { id: 65, icon: 'devices' , selected:false},
            { id: 66, icon: 'fmd_good' , selected:false},
            { id: 67, icon: 'gpp_bad' , selected:false},
            { id: 68, icon: 'gpp_good' , selected:false},
            { id: 69, icon: 'gpp_maybe' , selected:false},
            { id: 70, icon: 'gps_fixed' , selected:false},
            { id: 71, icon: 'attach_file' , selected:false},
            { id: 72, icon: 'format_color_fill' , selected:false},
            { id: 73, icon: 'pie_chart' , selected:false},
            { id: 74, icon: 'query_stats' , selected:false},
            { id: 75, icon: 'attach_email' , selected:false},
            { id: 76, icon: 'cloud_done' , selected:false},
            { id: 77, icon: 'cloud_download' , selected:false},
            { id: 78, icon: 'cloud_upload' , selected:false},
            { id: 79, icon: 'cases' , selected:false},
            { id: 80, icon: 'camera_alt' , selected:false},
            { id: 81, icon: 'collections' , selected:false},
            { id: 82, icon: 'movie_creation' , selected:false},
            { id: 83, icon: 'receipt_long' , selected:false},
            { id: 84, icon: 'timer' , selected:false},
            { id: 85, icon: 'video_camera_back' , selected:false},
            { id: 86, icon: 'add_business' , selected:false},
            { id: 87, icon: 'directions_car' , selected:false},
            { id: 88, icon: 'directions_bus' , selected:false},
            { id: 89, icon: 'directions_bike' , selected:false},
            { id: 90, icon: 'directions_boat' , selected:false},
            { id: 91, icon: 'electrical_services' , selected:false},
            { id: 92, icon: 'handyman' , selected:false},
            { id: 93, icon: 'home_repair_service' , selected:false},
            { id: 94, icon: 'local_grocery_store' , selected:false},
            { id: 95, icon: 'medical_services' , selected:false},
            { id: 96, icon: 'local_shipping' , selected:false},
            { id: 97, icon: 'store_mall_directory' , selected:false},
            { id: 98, icon: 'enhanced_encryption' , selected:false},
            { id: 99, icon: 'support_agent' , selected:false},
            { id: 100, icon: 'vpn_lock' , selected:false},
            { id: 101, icon: 'apartment' , selected:false},
            { id: 102, icon: 'food_bank' , selected:false},
            { id: 103, icon: 'coffee' , selected:false},
            { id: 104, icon: 'architecture' , selected:false},
            { id: 105, icon: 'engineering' , selected:false},
            { id: 106, icon: 'sanitizer' , selected:false},
            { id: 107, icon: 'sports_football' , selected:false},
            { id: 108, icon: 'reduce_capacity', selected:false },
            { id: 109, icon: 'watch_later', selected:false}


        ]


        public static getMaterialIcon(icon):any{
            let obj=null;
            extUtilities.MATERIAL_ICONS.forEach(element=>{
                if(Number.isNaN(parseInt(icon))){
                    if(element.icon==icon)obj=element;
                }else{
                    if(element.id==parseInt(icon))obj=element;
                }
            });
            return obj;
        }
}


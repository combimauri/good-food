export interface Irestaurant {
    name: string;
    type: string;
    categoryId: string;
    lat: number;
    lng: number;
    hasProfilePic: boolean;
    photoURL: string;
    addUserId: string;
    ownerId?: string;
    followersCount: number;
}

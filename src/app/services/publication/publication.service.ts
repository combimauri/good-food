import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { IpublicationId } from '../../interfaces/ipublication-id';
import { Ipublication } from '../../interfaces/ipublication';

@Injectable()
export class PublicationService {

  private publicationsCollection: AngularFirestoreCollection<Ipublication>;

  constructor(private afs: AngularFirestore, private subscriptions: SubscriptionsService) { }

  getPublicationsByRestaurantId(restaurantId: string): Observable<IpublicationId[]> {
    this.publicationsCollection = this.afs.collection<Ipublication>('publications', ref => ref.where('restaurantId', '==', restaurantId).orderBy('date', 'desc'));

    return this.publicationsCollection.snapshotChanges().takeUntil(this.subscriptions.unsubscribe).map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Ipublication;
        const id = a.payload.doc.id;
        const postDate: any = data.date;
        data.date = new Date(postDate.seconds * 1000);
        return { id, ...data };
      });
    });
  }

  savePublication(publication: IpublicationId): Observable<any> {
    const newPublication: Ipublication = this.buildPublicationInterface(publication);

    return Observable.fromPromise(this.publicationsCollection.add(newPublication)).takeUntil(this.subscriptions.unsubscribe);
  }

  private buildPublicationInterface(publication: IpublicationId): Ipublication {
    return {
      ownerName: publication.ownerName,
      paragraph: publication.paragraph,
      date: new Date(),
      status: publication.status,
      restaurantId: publication.restaurantId
    } as Ipublication;
  }
}

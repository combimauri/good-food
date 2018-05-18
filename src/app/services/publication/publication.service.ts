import { Injectable } from '@angular/core';
import { IpublicationId } from '../../interfaces/ipublication-id';
import { Observable } from 'rxjs/Observable';
import { Ipublication } from '../../interfaces/ipublication';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class PublicationService {

  private publicationCollection: AngularFirestoreCollection<Ipublication>;
  private publications: Observable<IpublicationId[]>;

  constructor(private afs: AngularFirestore, private subscriptions: SubscriptionsService) {
    this.publicationCollection = this.afs.collection<Ipublication>('publications');
    this.publications = this.publicationCollection.snapshotChanges().takeUntil(this.subscriptions.unsubscribe).map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Ipublication;
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    });
  }

  savePublication(publication: IpublicationId): Observable<any> {
    const newPublication: Ipublication = this.buildPublicationInterface(publication);

    return Observable.fromPromise(this.publicationCollection.add(newPublication)).takeUntil(this.subscriptions.unsubscribe);
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

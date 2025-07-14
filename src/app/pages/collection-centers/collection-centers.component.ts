import { Component } from '@angular/core';
import { MapCollectionCentersComponent } from '../../components/collection-centers/map-collection-centers/map-collection-centers.component';

@Component({
  selector: 'app-collection-centers',
  standalone: true,
  imports: [MapCollectionCentersComponent],
  templateUrl: './collection-centers.component.html',
  styleUrl: './collection-centers.component.scss'
})
export class CollectionCentersComponent {

}

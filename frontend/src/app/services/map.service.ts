import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';
import {Point} from "../models/Point";

@Injectable()
export class MapService {
  private pickedCords = new Subject<Array<number>>();
  private clickedPoint = new Subject<Point>();
  private changeCords = new Subject<Array<number>>();
  private turningOnPickMode = new Subject<any>();
  private icon = new Subject();

  private pointIcon = 'assets/podstawowa_wysokosciowa.png';

  constructor(private http: HttpClient) {
  }

  getPost(latlong): Observable<any> {
    return this.http.get('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + latlong[0] + '&lon=' + latlong[1]);
  }

  //^^^^^^^^^^^^^^^^^^Kliknięcie na MAPIE - pobranie współrzędnch i przesłanie ich do PANELU PUNKTU----------------------------
  // metoda getPickedCords() zwraca pickedCords jako observable - hej wy inni, patrzcie jak się będę zmieniał!
  //tam, gdzie wywołamy metodę getPickedCords przekażemy wartość zawartą w pickedCords (2 wartości)
  getPickedCords(): Observable<Array<number>> {
    return this.pickedCords.asObservable();
  }

  //cords to 2 wartości pochodzące z MAPY - współrzędne
  // next - będcordszie informował, że ma w sobie nowe współrzędne
  pickCords(cords) {
    this.pickedCords.next(cords);
  }

  //^^^^^^^^^^^^^^^^^^Kliknięcie na punkt na MAPIE i wyświetlenie szczegółów o nim w PANELU PUNKTU----------------------------
  getClickPoint(): Observable<Point> {
    return this.clickedPoint.asObservable();
  }

  clickPoint(point: Point) {
    this.clickedPoint.next(point);
  }

  //^^^^^^^^^^^^^^^^^^Pobranie punktu pochodzącego z PANELU PUNKTU i wyświetlenie na MAPIE----------------------------
  getChangeCords(): Observable<Array<number>> {
    return this.changeCords.asObservable();
  }

  // cords to 2 wartości pochodzące z PANELU PUNKTU - współrzędne
  // next - będzie informował, że ma w sobie nowe współrzędne
  setChangeCords(point) {
    this.changeCords.next(point);
  }

  //^^^^^^^^^^^^^^^^^^Kliknięcie na PANELU PUNKTU - przejście w tryb klikania na MAPIE----------------------------
  // Do przesyłania informacji, że panel dodawania znika a my mamy wybrać punkt z mapy
  // daj nam dostęp do skrzynki otrzymującej informacje o zmianach stanu turningOnPickMode
  getTurningOnPickMode(): Observable<any> {
    return this.turningOnPickMode.asObservable();
  }

  // powiadamiamy, że jesteśmy w trybie wyboru na mapie
  enablePickMode() {
    this.turningOnPickMode.next();
  }

  //^^^^^^^^^^^^^^^^^^Kliknięcie w PANELU PUNKTU na typ osnowy prześle nazwę obrazka do MAPY----------------------------
  setIcon() {
    return this.icon.asObservable();
  }

  changeIcon(ico) {
    this.pointIcon = ico.toString();
    this.icon.next(this.pointIcon);
  }
}
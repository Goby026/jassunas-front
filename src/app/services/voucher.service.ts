import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Voucher } from '../models/voucher.model';
import { VoucherDetalle } from '../models/voucherdetalle.model';

// const voucher_url = environment.voucher_url;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class VoucherService {
  constructor(private http: HttpClient) {}

  getAllVouchers(): Observable<Voucher[]> {
    return this.http
      .get(`${base_url}/vouchers`)
      .pipe(map((resp: any) => resp.vouchers as Voucher[]));
  }

  getVoucherDetails(idvoucher: number): Observable<VoucherDetalle[]> {
    return this.http
      .get(`${base_url}/voucher-detalles/voucher/${idvoucher}`)
      .pipe(
        map((response: any) => response.voucherdetalles as VoucherDetalle[])
      );
  }

  getVoucherByCliente(nombres: String): Observable<Voucher[]> {
    return this.http.get(`${base_url}/vouchers/search/${nombres}`).pipe(
      map( (res:any)=> {
        return res.vouchers as Voucher[]
      }),
      catchError((e) => {
        console.log(e.error.mensaje);
        return throwError(e);
      })
    );
  }

  saveVoucher(voucher: Voucher): Observable<Voucher> {
    return this.http.post<Voucher>(`${base_url}/vouchers`, voucher);
  }


  saveVoucherAndDetalles(voucher: Voucher, detalles: VoucherDetalle[]){

    let v:string = JSON.stringify(voucher);
    let d:string = JSON.stringify(detalles);

    let formData = new FormData();
    formData.append('voucher', v);
    formData.append('detalles', d);

    return this.http.post(`${base_url}/vouchers/save`, formData);
  }

  updateVoucher(voucher: Voucher): Observable<Voucher>{

    return this.http.put<Voucher>(`${base_url}/vouchers/${voucher.idvoucher}`, voucher);

  }

  uploadFile(archivo: File, id: any): Observable<Voucher> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    return this.http
      .post<Voucher>(`${base_url}/vouchers/upload`, formData)
      .pipe(
        map((res: any) => {
          return res.voucher as Voucher;
        }),
        catchError((e) => {
          console.log(e.error.mensaje);
          return throwError(e);
        })
      );
  }

  uploadVoucher(voucher: Voucher): Observable<Voucher> {
    return this.http.put<Voucher>(`${base_url}/vouchers/${voucher.idvoucher}`, voucher);
  }

  saveVoucherDetail(detalles: VoucherDetalle[]): Observable<VoucherDetalle[]> {
    return this.http
      .post(`${base_url}/voucher-detalles/service`, detalles)
      .pipe(
        map((resp: any) => {
          return resp.detalles as VoucherDetalle[];
        })
      );
  }
}

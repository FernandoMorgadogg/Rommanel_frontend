import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Formulario } from "../models/cadastro.model";
import { Observable } from "rxjs";

/**
 * Service responsible for handling operations related to the `Formulario` model.
 * Provides methods to interact with the backend API for creating and managing forms.
 *
 * @remarks
 * This service uses Angular's `HttpClient` to perform HTTP requests.
 *
 * @example
 * ```typescript
 * constructor(private formularioService: FormularioService) {}
 *
 * const formulario: Formulario = { ... };
 * this.formularioService.cadastrar(formulario).subscribe(() => {
 *   console.log('Form successfully submitted');
 * });
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class FormularioService {
  /**
   * Base URL for the API endpoint.
   * This should be set to the appropriate backend URL.
   */
  readonly url: string = '';

  /**
   * Creates an instance of `FormularioService`.
   *
   * @param http - The Angular `HttpClient` used for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Sends a POST request to the backend API to register a new form.
   *
   * @param formulario - The form data to be submitted.
   * @returns An `Observable` that emits when the request is complete.
   */
  cadastrar(formulario: Formulario): Observable<void> {
    return this.http.post<void>(`${this.url}/`, { formulario });
  }
}

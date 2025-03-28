import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
 
import { FormularioService } from './services/formulario.service';
import { Formulario } from './models/cadastro.model';
 
@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private formulario: FormularioService) {
    this.form = this.fb.group({
      razaoSocial: ['Empresa Teste', Validators.required],
      cpfCnpj: [
        '52998224725',
        [Validators.required, this.cpfCnpjValidator.bind(this)],
      ], // CPF válido para teste
      dataNascimento: ['1990-01-01', Validators.required],
      telefone: [
        '(11) 98765-4321',
        [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)],
      ],
      email: ['teste@exemplo.com', [Validators.required, Validators.email]],
      cep: [
        '12345-678',
        [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)],
      ],
      endereco: ['Rua Teste', Validators.required],
      numero: ['100', [Validators.required, Validators.min(1)]],
      bairro: ['Bairro Teste', Validators.required],
      cidade: ['Cidade Teste', Validators.required],
      estado: ['SP', Validators.required],
    });
  }

  cpfCnpjValidator(control: AbstractControl): ValidationErrors | null {
    const rawValue = control.value || '';
    // Remove todos os caracteres não numéricos
    const value = rawValue.replace(/\D/g, '');

    if (value.length === 11) {
      // CPF: valida utilizando o cálculo dos dígitos verificadores
      return this.validateCPF(value)
        ? null
        : { invalidCpfCnpj: 'CPF inválido' };
    } else if (value.length === 14) {
      // CNPJ: valida utilizando o cálculo dos dígitos verificadores
      return this.validateCNPJ(value)
        ? null
        : { invalidCpfCnpj: 'CNPJ inválido' };
    }
    return { invalidCpfCnpj: 'CPF ou CNPJ inválido' };
  }

  validateCPF(cpf: string): boolean {
    // Evita CPFs com todos os dígitos iguais (ex.: 11111111111)
    if (/^(\d)\1+$/.test(cpf)) return false;
    if (cpf.length !== 11) return false;

    // Cálculo do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    let checkDigit1 = remainder < 2 ? 0 : 11 - remainder;
    if (checkDigit1 !== parseInt(cpf.charAt(9))) return false;

    // Cálculo do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    let checkDigit2 = remainder < 2 ? 0 : 11 - remainder;
    return checkDigit2 === parseInt(cpf.charAt(10));
  }

  validateCNPJ(cnpj: string): boolean {
    // Evita CNPJs com todos os dígitos iguais
    if (/^(\d)\1+$/.test(cnpj)) return false;
    if (cnpj.length !== 14) return false;

    const weightsFirst = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weightsSecond = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj.charAt(i)) * weightsFirst[i];
    }
    let remainder = sum % 11;
    let checkDigit1 = remainder < 2 ? 0 : 11 - remainder;
    if (checkDigit1 !== parseInt(cnpj.charAt(12))) return false;

    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj.charAt(i)) * weightsSecond[i];
    }
    remainder = sum % 11;
    let checkDigit2 = remainder < 2 ? 0 : 11 - remainder;
    return checkDigit2 === parseInt(cnpj.charAt(13));
  }

  getErrorMessage(field: string): string {
    if (!this.form.controls[field]) return '';
    const control = this.form.controls[field];
    if (control.hasError('required')) return 'Campo obrigatório';
    if (control.hasError('pattern')) return 'Formato inválido';
    if (control.hasError('email')) return 'Email inválido';
    if (control.hasError('min')) return 'Número inválido';
    if (control.hasError('invalidCpfCnpj')) return 'CPF ou CNPJ inválido';

    return '';
  }

  onSubmit() {
    if (this.form.valid) {
      const formulario: Formulario = this.form.value;
      this.formulario.cadastrar(formulario).subscribe({
        error(err) {
          //Se der erro
        },
        next(value) {
          // Onde o retorno do Servidor
        },
        complete: () => {
          // Quando Termina todos os processos
        },
      });
    }  
  }
}

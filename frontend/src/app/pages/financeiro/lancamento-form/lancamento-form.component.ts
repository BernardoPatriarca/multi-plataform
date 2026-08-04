import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
  IonItem, IonInput, IonTextarea, IonLabel, IonSpinner, IonSelect, IonSelectOption,
  IonSegment, IonSegmentButton, IonGrid, IonRow, IonCol, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, saveOutline, trendingUpOutline, trendingDownOutline } from 'ionicons/icons';
import {
  FORMAS_PAGAMENTO, Lancamento, LancamentoRequest, STATUS_LANCAMENTO
} from '../../../core/models/lancamento.model';
import { LancamentoService } from '../../../core/services/lancamento.service';

@Component({
  selector: 'app-lancamento-form',
  standalone: true,
  templateUrl: './lancamento-form.component.html',
  styleUrls: ['./lancamento-form.component.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
    IonItem, IonInput, IonTextarea, IonLabel, IonSpinner, IonSelect, IonSelectOption,
    IonSegment, IonSegmentButton, IonGrid, IonRow, IonCol
  ]
})
export class LancamentoFormComponent implements OnInit {
  @Input() lancamento: Lancamento | null = null;

  private fb = inject(FormBuilder);
  private lancamentoService = inject(LancamentoService);
  private modalController = inject(ModalController);

  loading = false;
  errorMessage = '';
  formasPagamento = FORMAS_PAGAMENTO;
  statusOpcoes = STATUS_LANCAMENTO;

  form = this.fb.nonNullable.group({
    descricao: ['', [Validators.required, Validators.maxLength(200)]],
    tipo: ['DESPESA', [Validators.required]],
    categoria: ['', [Validators.maxLength(100)]],
    valor: [0, [Validators.required, Validators.min(0.01)]],
    formaPagamento: [''],
    status: ['PENDENTE', [Validators.required]],
    dataVencimento: [''],
    dataPagamento: [''],
    observacoes: ['']
  });

  constructor() {
    addIcons({ closeOutline, saveOutline, trendingUpOutline, trendingDownOutline });
  }

  get isEdit(): boolean {
    return !!this.lancamento;
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    if (this.lancamento) {
      this.form.patchValue({
        descricao: this.lancamento.descricao,
        tipo: this.lancamento.tipo,
        categoria: this.lancamento.categoria ?? '',
        valor: this.lancamento.valor,
        formaPagamento: this.lancamento.formaPagamento ?? '',
        status: this.lancamento.status,
        dataVencimento: this.lancamento.dataVencimento ?? '',
        dataPagamento: this.lancamento.dataPagamento ?? '',
        observacoes: this.lancamento.observacoes ?? ''
      });
    }
  }

  dismiss(): void {
    this.modalController.dismiss(null, 'cancel');
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const raw = this.form.getRawValue();
    const payload: LancamentoRequest = {
      descricao: raw.descricao,
      tipo: raw.tipo as LancamentoRequest['tipo'],
      categoria: raw.categoria || undefined,
      valor: raw.valor,
      formaPagamento: (raw.formaPagamento || undefined) as LancamentoRequest['formaPagamento'],
      status: raw.status as LancamentoRequest['status'],
      dataVencimento: raw.dataVencimento || undefined,
      dataPagamento: raw.dataPagamento || undefined,
      observacoes: raw.observacoes || undefined
    };

    const request$ = this.isEdit
      ? this.lancamentoService.update(this.lancamento!.id, payload)
      : this.lancamentoService.create(payload);

    request$.subscribe({
      next: (result) => {
        this.loading = false;
        this.modalController.dismiss(result, 'saved');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Nao foi possivel salvar o lancamento.';
      }
    });
  }
}

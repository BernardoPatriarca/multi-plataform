import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
  IonItem, IonInput, IonTextarea, IonToggle, IonLabel, IonSpinner, IonSelect, IonSelectOption,
  IonGrid, IonRow, IonCol, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, saveOutline, cubeOutline } from 'ionicons/icons';
import { Produto, ProdutoRequest, UNIDADES_MEDIDA } from '../../../core/models/produto.model';
import { ProdutoService } from '../../../core/services/produto.service';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
    IonItem, IonInput, IonTextarea, IonToggle, IonLabel, IonSpinner, IonSelect, IonSelectOption,
    IonGrid, IonRow, IonCol
  ]
})
export class ProdutoFormComponent implements OnInit {
  @Input() produto: Produto | null = null;

  private fb = inject(FormBuilder);
  private produtoService = inject(ProdutoService);
  private modalController = inject(ModalController);

  loading = false;
  errorMessage = '';
  unidades = UNIDADES_MEDIDA;

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(150)]],
    codigo: ['', [Validators.required, Validators.maxLength(50)]],
    codigoBarras: ['', [Validators.maxLength(50)]],
    categoria: ['', [Validators.maxLength(100)]],
    descricao: [''],
    unidadeMedida: ['UN', [Validators.required]],
    precoCusto: [0, [Validators.required, Validators.min(0)]],
    precoVenda: [0, [Validators.required, Validators.min(0)]],
    quantidadeEstoque: [0, [Validators.required, Validators.min(0)]],
    estoqueMinimo: [0, [Validators.required, Validators.min(0)]],
    fornecedor: ['', [Validators.maxLength(150)]],
    localizacao: ['', [Validators.maxLength(100)]],
    ativo: [true]
  });

  constructor() {
    addIcons({ closeOutline, saveOutline, cubeOutline });
  }

  get isEdit(): boolean {
    return !!this.produto;
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    if (this.produto) {
      this.form.patchValue({
        nome: this.produto.nome,
        codigo: this.produto.codigo,
        codigoBarras: this.produto.codigoBarras ?? '',
        categoria: this.produto.categoria ?? '',
        descricao: this.produto.descricao ?? '',
        unidadeMedida: this.produto.unidadeMedida,
        precoCusto: this.produto.precoCusto,
        precoVenda: this.produto.precoVenda,
        quantidadeEstoque: this.produto.quantidadeEstoque,
        estoqueMinimo: this.produto.estoqueMinimo,
        fornecedor: this.produto.fornecedor ?? '',
        localizacao: this.produto.localizacao ?? '',
        ativo: this.produto.ativo
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
    const payload: ProdutoRequest = {
      nome: raw.nome,
      codigo: raw.codigo,
      codigoBarras: raw.codigoBarras || undefined,
      categoria: raw.categoria || undefined,
      descricao: raw.descricao || undefined,
      unidadeMedida: raw.unidadeMedida as ProdutoRequest['unidadeMedida'],
      precoCusto: raw.precoCusto,
      precoVenda: raw.precoVenda,
      quantidadeEstoque: raw.quantidadeEstoque,
      estoqueMinimo: raw.estoqueMinimo,
      fornecedor: raw.fornecedor || undefined,
      localizacao: raw.localizacao || undefined,
      ativo: raw.ativo
    };

    const request$ = this.isEdit
      ? this.produtoService.update(this.produto!.id, payload)
      : this.produtoService.create(payload);

    request$.subscribe({
      next: (result) => {
        this.loading = false;
        this.modalController.dismiss(result, 'saved');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Nao foi possivel salvar o produto.';
      }
    });
  }
}

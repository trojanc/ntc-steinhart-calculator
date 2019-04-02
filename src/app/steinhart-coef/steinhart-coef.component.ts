import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationSessionService } from '../application-session.service';
import {SteinhartCoefInfo, calculateTemperature} from '../classes/steinhart-coef-info';
@Component({
  selector: 'app-steinhart-coef',
  templateUrl: './steinhart-coef.component.html',
  styleUrls: ['./steinhart-coef.component.css']
})
export class SteinhartCoefComponent implements OnInit {

  steinhartCoefForm: FormGroup;
  results = [];

  

  constructor(private formBuilder: FormBuilder,
    private applicationSession: ApplicationSessionService) {
    this.initForms();
  }

  ngOnInit(){
    this.steinhartCoefForm.patchValue(this.applicationSession.steinhartCoefInfo);
    this.calculateSteinhartCoefs();
  }

  private initForms() {
    this.steinhartCoefForm = this.formBuilder.group({
      inputUnit: ['1', Validators.required],
      t1: [null, Validators.required],
      t2: [null, Validators.required],
      t3: [null, Validators.required],
      rt1: [null, Validators.required],
      rt2: [null, Validators.required],
      rt3: [null, Validators.required],
      a: [null, Validators.required],
      b: [null, Validators.required],
      c: [null, Validators.required],
    });
  }


  private toKelvin(temperature: number) {
    const unit = this.steinhartCoefForm.controls['inputUnit'].value;

    // Celcius
    if (unit == 1) {
      return temperature + 273.15;
    }
    else if (unit == 2) {
      return (((temperature - 32) * 5) / 9) + 273.15;
    }
    else {
      return temperature;
    }
  }

  calculateSteinhartCoefs() {
    const T1 = this.toKelvin(+this.steinhartCoefForm.controls['t1'].value);
    const T2 = this.toKelvin(+this.steinhartCoefForm.controls['t2'].value);
    const T3 = this.toKelvin(+this.steinhartCoefForm.controls['t3'].value);

    const R1 = +this.steinhartCoefForm.controls['rt1'].value;
    const R2 = +this.steinhartCoefForm.controls['rt2'].value;
    const R3 = +this.steinhartCoefForm.controls['rt3'].value;

    const L1 = Math.log(R1);
    const L2 = Math.log(R2);
    const L3 = Math.log(R3);

    const Y1 = 1 / T1;
    const Y2 = 1 / T2;
    const Y3 = 1 / T3;

    const U2 = (Y2 - Y1) / (L2 - L1);
    const U3 = (Y3 - Y1) / (L3 - L1);

    const C = (U3 - U2) / (L3 - L2) * Math.pow(L1 + L2 + L3, -1);
    const B = U2 - C * (L1 * L1 + L1 * L2 + L2 * L2);
    const A = Y1 - (B + L1 * L1 * C) * L1;
    this.steinhartCoefForm.patchValue({
      a: A,
      b: B,
      c: C,
    });

    this.applicationSession.steinhartCoefInfo = {...this.steinhartCoefForm.value};
    this.calculateNtcGraph();
  }

  calculateNtcGraph() {

    const R1 = +this.steinhartCoefForm.controls['rt1'].value;
    const R3 = +this.steinhartCoefForm.controls['rt3'].value;
    const A = +this.steinhartCoefForm.controls['a'].value;
    const B = +this.steinhartCoefForm.controls['b'].value;
    const C = +this.steinhartCoefForm.controls['c'].value;

    const series = [];
    for (let r = R3; r < R1; r += 50) {
      series.push({
        value: calculateTemperature(r, A, B, C),
        name: r + "Ohm"
      })
    }
    this.results = [
      {
        "name": "Curve",
        "series": series
      }
    ];
  }

}
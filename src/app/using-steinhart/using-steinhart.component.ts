import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationSessionService } from '../application-session.service';
import {calculateTemperature} from '../classes/steinhart-coef-info';

@Component({
  selector: 'app-using-steinhart',
  templateUrl: './using-steinhart.component.html',
  styleUrls: ['./using-steinhart.component.css']
})
export class UsingSteinhartComponent implements OnInit {

  steinhartCoefForm: FormGroup;
  steinhartCoefTestForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private applicationSession: ApplicationSessionService) { 
    this.initForm();
  }

  initForm(): void {
    this.steinhartCoefForm = this.formBuilder.group({
        a : [null, Validators.required],
        b : [null, Validators.required],
        c : [null, Validators.required],
        r2 : [null, Validators.required],
        vcc : [null, Validators.required],
    });
    this.steinhartCoefTestForm = this.formBuilder.group({
        rntc : [null, Validators.required],
        temperature : [null, Validators.required],
    });
  }

  usePreviousCoefs(): void {
    this.steinhartCoefForm.patchValue({
      a : this.applicationSession.steinhartCoefInfo.a,
      b : this.applicationSession.steinhartCoefInfo.b,
      c : this.applicationSession.steinhartCoefInfo.c,
      r2 : this.applicationSession.ntcInfo.r2_used,
      vcc : this.applicationSession.circuitInfo.vcc,
    })
  }

  ngOnInit() {
    this.usePreviousCoefs();
  }

  /**
   * Caculate the temperature from the NTC resistance
   */
  calculateFromNtc(): void {
    const A = +this.steinhartCoefForm.value.a;
    const B = +this.steinhartCoefForm.value.b;
    const C = +this.steinhartCoefForm.value.c;
    let R_NTC = this.steinhartCoefTestForm.value.rntc;   

    this.steinhartCoefTestForm.patchValue({
      temperature : calculateTemperature(R_NTC, A, B, C)
    });
  }

}
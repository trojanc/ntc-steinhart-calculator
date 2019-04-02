import { Injectable } from '@angular/core';
import { CircuitInfo } from './classes/circuit-info';
import { NtcInfo } from './classes/ntc-info';
import { SteinhartCoefInfo } from './classes/steinhart-coef-info';

@Injectable()
export class ApplicationSessionService {

  circuitInfo: CircuitInfo

  ntcInfo: NtcInfo;

  steinhartCoefInfo: SteinhartCoefInfo;

  constructor() {
    this.circuitInfo = {
      vcc: 3.3,
      va: 1,
      vares: 1024,
      varesv: 0
    };

    this.ntcInfo = {
      rntc: 10000,
      rntcmax: 18000,
      rntcmin: 3000,
      vntcmaxa: null,
      vntcmina: null,
      r2_best: null,
      r2_used: 42000,
      vntcmax: null,
      vntcmin: null,
      amax: null,
      amin: null,
      arange: null,
    };

    this.steinhartCoefInfo = {
      inputUnit: '1',
      t1: 0,
      t2: 25,
      t3: 100,
      rt1: 16000,
      rt2: 3977,
      rt3: 320,
      a: null,
      b: null,
      c: null,
    }
  }

}
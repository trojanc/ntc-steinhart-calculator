import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationSessionService } from '../application-session.service';

@Component({
  selector: 'app-resistor-calculator',
  templateUrl: './resistor-calculator.component.html',
  styleUrls: ['./resistor-calculator.component.css']
})
export class ResistorCalculatorComponent implements OnInit {
  circuitForm: FormGroup;
  ntcForm: FormGroup;
  
  @ViewChild('myCanvas') 
  canvasRef: ElementRef;

  constructor(private formBuilder: FormBuilder,
    private applicationSession: ApplicationSessionService) { 
      this.initForms();
    }

  ngOnInit() {
    this.circuitForm.patchValue(this.applicationSession.circuitInfo);
    this.ntcForm.patchValue(this.applicationSession.ntcInfo);
    this.recalculateCircuit();
    this.drawCircuit();
  }

  private initForms() {
    this.circuitForm = this.formBuilder.group({
      vcc: [0, Validators.required],
      va: [0, Validators.required],
      vares: [0, Validators.required],
      varesv: [0, Validators.required],
    });

    this.ntcForm = this.formBuilder.group({
      rntc: [null, Validators.required],
      rntcmax: [null, Validators.required],
      rntcmin: [null, Validators.required],
      vntcmaxa: [null, Validators.required],
      vntcmina: [null, Validators.required],
      r2_best: [null, Validators.required],
      r2_used: [null, Validators.required],
      vntcmax: [null, Validators.required],
      vntcmin: [null, Validators.required],
      amax: [null, Validators.required],
      amin: [null, Validators.required],
      arange: [null, Validators.required],
    });
  }

  private drawCircuit(){
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.font = "14px Arial";
    ctx.textAlign = "center";

    const HEIGHT = 100;
    const RESISTOR_H = 14;
    const RESISTOR_W = 50;
    const ARROW_SIZE = 5;
    const LINE_SEPERATION = 50;
    let x = 15; // Where we are on the x axis

    // VCC
    ctx.moveTo(x, HEIGHT / 2);
    ctx.lineTo(x, (HEIGHT / 2) - 15);
    ctx.stroke();
    // VCC Arrow
    ctx.moveTo(x, (HEIGHT / 2) - 15);
    ctx.lineTo(x + ARROW_SIZE, (HEIGHT / 2) - 15 + ARROW_SIZE);
    ctx.lineTo(x - ARROW_SIZE, (HEIGHT / 2) - 15 + ARROW_SIZE);
    ctx.lineTo(x, (HEIGHT / 2) - 15);
    ctx.stroke();
    // Vcc text
    ctx.fillText("Vcc", x,  (HEIGHT / 2) - 25);

    // Start of circuit
    ctx.moveTo(x, HEIGHT / 2);
    ctx.lineTo(LINE_SEPERATION, HEIGHT / 2);
    ctx.stroke();
    x = LINE_SEPERATION;

    // R2
    ctx.rect(x, (HEIGHT / 2) - (RESISTOR_H / 2), RESISTOR_W, RESISTOR_H);
    // R2 text
    ctx.fillText("R2", x + (RESISTOR_W / 2) , (HEIGHT / 2) - RESISTOR_H);

    x += RESISTOR_W;

    // Line to Analog
    ctx.moveTo(x, HEIGHT / 2);
    ctx.lineTo(x + LINE_SEPERATION, HEIGHT / 2);
    ctx.stroke();
    x += LINE_SEPERATION;

    // Analog probe
    ctx.moveTo(x, HEIGHT / 2);
    ctx.lineTo(x, 15);
    ctx.stroke();
    // Arrow
    ctx.moveTo(x, HEIGHT / 2);
    ctx.lineTo(x + ARROW_SIZE, (HEIGHT / 2) - ARROW_SIZE);
    ctx.lineTo(x - ARROW_SIZE, (HEIGHT / 2) - ARROW_SIZE);
    ctx.lineTo(x, HEIGHT / 2);
    ctx.stroke();

    // A0 text
    ctx.fillText("Analog", x, 10); 

    // Line to R1
    ctx.moveTo(x, HEIGHT / 2);
    ctx.lineTo(x + LINE_SEPERATION, HEIGHT / 2);
    ctx.stroke();
    x += LINE_SEPERATION;

    // R1 - NTC
    ctx.rect(x, (HEIGHT / 2) - (RESISTOR_H / 2), RESISTOR_W, RESISTOR_H);
    // NTC line
    ctx.moveTo(x, (HEIGHT / 2) + RESISTOR_H );
    ctx.lineTo(x + RESISTOR_H, (HEIGHT / 2) + RESISTOR_H);
    ctx.lineTo(x + RESISTOR_W - 10, (HEIGHT / 2) - RESISTOR_H);
    ctx.stroke();
    // R1 text
    ctx.fillText("R1", x + (RESISTOR_W / 2) , (HEIGHT / 2) - RESISTOR_H);

    x += RESISTOR_W;


    // Line to Ground
    ctx.moveTo(x, HEIGHT / 2);
    ctx.lineTo(x + LINE_SEPERATION, HEIGHT / 2);
    ctx.stroke();
    x += LINE_SEPERATION;

    // Ground
    ctx.moveTo(x, HEIGHT / 2);
    ctx.lineTo(x, (HEIGHT / 2) + 10);
    ctx.stroke();
    // First line
    ctx.moveTo(x-8, (HEIGHT / 2) + 10);
    ctx.lineTo(x+8, (HEIGHT / 2) + 10);
    ctx.stroke();
    // Second line
    ctx.moveTo(x-6, (HEIGHT / 2) + 15);
    ctx.lineTo(x+6, (HEIGHT / 2) + 15);
    ctx.stroke();
    // Third line
    ctx.moveTo(x-3, (HEIGHT / 2) + 20);
    ctx.lineTo(x+3, (HEIGHT / 2) + 20);
    ctx.stroke();

    ctx.stroke();
  }

  private updateServiceObject(){
    this.applicationSession.circuitInfo = {...this.circuitForm.value};
    this.applicationSession.ntcInfo = {...this.ntcForm.value};
  }

  /**
   * Calculate the voltage per analog value
   */
  recalculateCircuit() {
    const va = +this.circuitForm.controls['va'].value;
    const vares = +this.circuitForm.controls['vares'].value;
    const varesv = va / vares;
    this.circuitForm.patchValue({ varesv: varesv });
    this.recalculateThermistor();
  }

  recalculateThermistor() {
    // Voltage applied across the circuit
    const vcc = +this.circuitForm.controls['vcc'].value;
    
    // Max voltage the Analog can register
    const va = +this.circuitForm.controls['va'].value;

    // Maximum resistance of the NTC
    const rntcmax = +this.ntcForm.controls['rntcmax'].value;

    // Minimum resistance of the NTC
    const rntcmin = +this.ntcForm.controls['rntcmin'].value;

    // Normal resistance of the NTC
    const rntc = +this.ntcForm.controls['rntc'].value;

    // First calculate what the min and max Vntc would have been if we are using
    // a R2 with the same resistance as the NTC's normal resistance
    const vntcmaxa = vcc * (rntcmax / (rntcmax + rntc));
    const vntcmina = vcc * (rntcmin / (rntcmin + rntc));

    // Now lets calculate what the best value for R2 would be so that the max
    // voltage would be at the highest the Analog can read
    const r2_best = ((vcc * rntcmax) / va) - rntcmax;

    this.ntcForm.patchValue({
      vntcmaxa: vntcmaxa,
      vntcmina: vntcmina,
      r2_best: r2_best
    });

    this.updateServiceObject();
    this.recalculateVNtcRange()
  }

  recalculateVNtcRange() {
    // Voltage applied across the circuit
    const vcc = +this.circuitForm.controls['vcc'].value;

    // Maximum resistance of the NTC
    const rntcmax = +this.ntcForm.controls['rntcmax'].value;

    // Minimum resistance of the NTC
    const rntcmin = +this.ntcForm.controls['rntcmin'].value;

    // Value of the R2 resistor that was used
    const r2_used = +this.ntcForm.controls['r2_used'].value;

    // New limits for the voltage the analog would read
    const vntcmax = vcc * (rntcmax / (rntcmax + r2_used));
    const vntcmin = vcc * (rntcmin / (rntcmin + r2_used));

    // Resolution of the Analog
    const vares = +this.circuitForm.controls['vares'].value;

    // Minimum analog reading for Vntc min
    const amin = Math.floor(vntcmin * vares);

    // Maximum analog reading for Vntc max
    const amax = Math.min(vares, Math.floor(vntcmax * vares));

    // The range of the analog that we are using
    const arange = amax - amin;

    this.ntcForm.patchValue({
      vntcmax: vntcmax,
      vntcmin: vntcmin,
      amin: amin,
      amax: amax,
      arange: arange,
    });
    this.updateServiceObject();
  }
}
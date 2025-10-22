import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appRainbow]',
  standalone: true
})
export class RainbowDirective {
  private colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  @HostBinding('style.color') color!: string;
  @HostBinding('style.borderColor') borderColor!: string;
  @HostBinding('style.borderStyle') borderStyle = 'solid';
  @HostBinding('style.borderWidth') borderWidth = '1px';

  constructor() {
    this.setRandomColor();
  }

  @HostListener('keyup')
  onKeyUp() {
    this.setRandomColor();
  }

  private setRandomColor() {
    const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.color = randomColor;
    this.borderColor = randomColor;
  }
}

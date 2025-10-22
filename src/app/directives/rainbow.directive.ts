import { Directive, HostBinding, ElementRef, effect } from '@angular/core';
import { signal } from '@angular/core';

@Directive({
  selector: 'input[appRainbowSignal]',
  standalone: true
})
export class RainbowSignalDirective {
  colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  @HostBinding('style.color') colorStyle = 'black';
  @HostBinding('style.borderColor') borderColor = 'black';
  @HostBinding('style.borderStyle') borderStyle = 'solid';
  @HostBinding('style.borderWidth') borderWidth = '1px';
  color = signal('black');
  constructor(private el: ElementRef<HTMLInputElement>) {
    effect(() => {
      const newColor = this.color();
      this.colorStyle = newColor;
      this.borderColor = newColor;
    });
    el.nativeElement.addEventListener('keyup', () => {
      const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.color.set(randomColor);
    });
  }
}

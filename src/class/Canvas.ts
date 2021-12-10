export default class Canvas {
  private wrapper: HTMLDivElement;

  private canvas: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D | null;

  constructor(elementID: string) {
    this.canvas = document.getElementById(elementID) as HTMLCanvasElement;
    this.wrapper = this.canvas.closest('div') as HTMLDivElement;
    this.ctx = null;

    this.initCanvas();
  }

  initCanvas(): void {
    this.resizeCanvas();
    this.ctx = this.canvas.getContext('2d');
  }

  resizeCanvas(): void {
    const ww = this.wrapper.offsetWidth.toString();
    const wh = this.wrapper.offsetHeight.toString();
    this.canvas.setAttribute('width', ww);
    this.canvas.setAttribute('height', wh);
    this.canvas.style.width = `${ww}px`;
    this.canvas.style.height = `${wh}px`;
  }

  getWindowWidth(): number {
    return this.canvas.offsetWidth;
  }

  getWindowHeight(): number {
    return this.canvas.offsetHeight;
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D {
    return <CanvasRenderingContext2D> this.ctx;
  }
}

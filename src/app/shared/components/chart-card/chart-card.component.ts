import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartCardComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() type: ChartType = 'line';
  @Input() labels: string[] = [];
  @Input() datasets: ChartConfiguration['data']['datasets'] = [];
  @Input() height = 260;
  @Input() isLoading = false;

  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private resizeTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor(private readonly ngZone: NgZone) {}

  ngAfterViewInit(): void {
    if (!this.isLoading) this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['labels'] || changes['datasets'] || changes['isLoading']) &&
      !this.isLoading
    ) {
      setTimeout(() => {
        if (this.canvasRef?.nativeElement) this.renderChart();
      }, 0);
    }
  }

  private renderChart(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas?.parentElement) return;

    if (this.chart) {
      this.chart.data.labels = this.labels;
      this.chart.data.datasets = this.datasets;
      this.chart.update('none');
      return;
    }

    this.chart = new Chart(canvas, {
      type: this.type,
      data: { labels: this.labels, datasets: this.datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: {
          legend: { display: this.type === 'doughnut', position: 'bottom' },
        },
        scales: this.type === 'doughnut' ? {} : { y: { beginAtZero: true } },
      },
    });

    this.observeResize(canvas.parentElement);
  }

  private observeResize(container: HTMLElement): void {
    this.resizeObserver?.disconnect();

    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => this.chart?.resize(), 100);
      });
      this.resizeObserver.observe(container);
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    clearTimeout(this.resizeTimeout);
    this.chart?.destroy();
  }
}

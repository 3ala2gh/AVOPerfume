export type CarouselDragState = {
  pointerId: number
  startX: number
  startY: number
  scrollLeft: number
  axis: 'horizontal' | 'vertical' | null
}

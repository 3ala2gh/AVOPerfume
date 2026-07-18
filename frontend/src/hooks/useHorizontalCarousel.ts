import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import type { CarouselDragState } from '../types/carousel'

type ScrollDirection = 'previous' | 'next'

export function useHorizontalCarousel(itemCount: number) {
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const dragState = useRef<CarouselDragState | null>(null)
  const ignoreNextClick = useRef(false)
  const clickResetTimer = useRef<number | null>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollButtons = useCallback(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const maxScroll = carousel.scrollWidth - carousel.clientWidth
    const scrollPosition = Math.abs(carousel.scrollLeft)

    setCanScrollPrev(scrollPosition > 4)
    setCanScrollNext(scrollPosition < maxScroll - 4)
  }, [])

  useEffect(() => {
    updateScrollButtons()

    const carousel = carouselRef.current
    if (!carousel) return

    const resizeObserver = new ResizeObserver(updateScrollButtons)
    resizeObserver.observe(carousel)

    return () => {
      resizeObserver.disconnect()
      if (clickResetTimer.current !== null) {
        window.clearTimeout(clickResetTimer.current)
      }
    }
  }, [itemCount, updateScrollButtons])

  const scrollCarousel = (direction: ScrollDirection) => {
    const carousel = carouselRef.current
    if (!carousel) return

    const isRtl = getComputedStyle(carousel).direction === 'rtl'
    const distance = carousel.clientWidth * 0.85
    const multiplier = direction === 'next' ? 1 : -1

    carousel.scrollBy({
      left: distance * multiplier * (isRtl ? -1 : 1),
      behavior: 'smooth',
    })
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (clickResetTimer.current !== null) {
      window.clearTimeout(clickResetTimer.current)
      clickResetTimer.current = null
    }

    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: event.currentTarget.scrollLeft,
      axis: null,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = dragState.current
    const carousel = carouselRef.current
    if (!state || !carousel || state.pointerId !== event.pointerId) return

    const deltaX = event.clientX - state.startX
    const deltaY = event.clientY - state.startY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (state.axis === null && (absX > 8 || absY > 8)) {
      state.axis = absX > absY * 1.2 ? 'horizontal' : 'vertical'
      if (state.axis === 'horizontal') {
        carousel.setPointerCapture(event.pointerId)
      }
    }

    if (state.axis !== 'horizontal') return

    ignoreNextClick.current = true
    carousel.scrollLeft = state.scrollLeft - deltaX
    updateScrollButtons()
  }

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current
    if (carousel?.hasPointerCapture(event.pointerId)) {
      carousel.releasePointerCapture(event.pointerId)
    }
    dragState.current = null

    if (ignoreNextClick.current) {
      clickResetTimer.current = window.setTimeout(() => {
        ignoreNextClick.current = false
        clickResetTimer.current = null
      }, 120)
    }
  }

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!ignoreNextClick.current) return

    event.preventDefault()
    event.stopPropagation()
    ignoreNextClick.current = false
    if (clickResetTimer.current !== null) {
      window.clearTimeout(clickResetTimer.current)
      clickResetTimer.current = null
    }
  }

  return {
    carouselRef,
    canScrollPrev,
    canScrollNext,
    scrollCarousel,
    carouselHandlers: {
      onScroll: updateScrollButtons,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onPointerCancel: handlePointerEnd,
      onClickCapture: handleClickCapture,
    },
  }
}

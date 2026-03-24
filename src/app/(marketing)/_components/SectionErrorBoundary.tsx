'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { SectionErrorBoundaryProps } from '@/lib/types/landing';

interface State {
  hasError: boolean;
}

export class SectionErrorBoundary extends Component<SectionErrorBoundaryProps, State> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      `[SectionErrorBoundary] Error in section "${this.props.sectionName}":`,
      error,
      errorInfo
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="flex items-center justify-center bg-hud-bg border border-white/5 rounded"
          style={{ minHeight: this.props.fallbackHeight || '200px' }}
        >
          <div className="flex items-center gap-3 text-white/30 font-mono text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400/60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400/40" />
            </span>
            <span>Section temporarily unavailable</span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

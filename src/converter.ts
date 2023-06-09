// eslint-disable-next-line import/no-unresolved
import {Log, Result} from 'sarif'
import {BaselineState} from './main'

export class Converter {
  private config: ConverterConfig

  constructor(config: ConverterConfig) {
    this.config = config
  }

  convert(log: Log): Output {
    return {
      title: this.createTitle(log),
      summary: this.createSummary(log),
      text: this.createText(log),
      annotations: this.createAnnotations(log)
    }
  }

  // I don't know why the linter cries here???
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected createTitle(log: Log): string {
    return 'SARIF Report'
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected createSummary(log: Log): string {
    return ''
  }

  protected createText(log: Log): string {
    return log.runs[0].tool.driver.name
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected createAnnotations(log: Log): Annotation[] {
    return []
  }

  protected filteredResults(log: Log): Result[] {
    const baselineMatches = (result: Result): boolean => {
      if (!this.config.baselineStates || this.config.baselineStates.length === 0) {
        return true // "all" filter
      }
      if (!result.baselineState) {
        return false // not available but should be
      }
      return this.config.baselineStates.includes(result.baselineState)
    }
    return log.runs[0].results?.filter(baselineMatches) ?? []
  }
}

export type AnnotationLevel = 'notice' | 'warning' | 'failure'

export interface Annotation {
  path: string
  start_line: number
  end_line: number
  start_column: number | undefined
  end_column: number | undefined
  annotation_level: AnnotationLevel
  message: string
  title?: string
  raw_details?: string
  // actions, not supported by us
}

export interface Output {
  title: string
  summary: string
  text: string
  annotations: Annotation[]
}

export interface ConverterConfig {
  baselineStates: BaselineState[] | null
}

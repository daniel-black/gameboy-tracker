/**
 * The number of rows in a pattern. By convention, this is 64. Since each beat is 4 rows, this means that there are 16 beats in a pattern.
 */
export const ROWS_PER_PATTERN = 64 as const;

/**
 * The number of rows per beat in the tracker. Each beat is a quarter note and there are 4 rows per beat.
 * This means that there are 16 rows per whole note.
 */
export const ROWS_PER_BEAT = 4 as const;

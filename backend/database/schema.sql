DROP TABLE IF EXISTS fitdata;

CREATE TABLE fitdata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  trace INTEGER NOT NULL,
  fit_param_d1 DOUBLE NOT NULL,
  fit_param_a1 DOUBLE NOT NULL,
  fit_param_d2 DOUBLE NOT NULL,
  fit_param_a2 DOUBLE NOT NULL,
  fit_param_c DOUBLE NOT NULL,
  fit_idx_xstart INTEGER NOT NULL,
  fit_idx_xend INTEGER NOT NULL,
  fit_value_ystart DOUBLE NOT NULL,
  fit_value_yend DOUBLE NOT NULL,
  ref_idx_xstart INTEGER NOT NULL,
  ref_idx_xend INTEGER NOT NULL,
  ref_value_ystart DOUBLE NOT NULL,
  ref_value_yend DOUBLE NOT NULL
);

import React from 'react';

export const DownloadButton = ({ hasData, validRange, onClick }) => {
  let fa = 'fas ';
  let className = 'btn btn-link btn-load-data ';
  let disabled = false;
  if (!hasData && validRange) {
    fa += 'fa-download';
    disabled = false;
  } else if (!validRange) {
    fa += 'fa-times';
    disabled = true;
  } else {
    fa += 'fa-check';
    disabled = true;
  }

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      <i className={fa} />
    </button>
  );
};

export const CheckboxButton = ({ checked, onClick }) => {
  return (
    <button className="btn btn-link" onClick={onClick}>
      <i className={checked ? 'fas fa-check' : 'fas fa-times'} />
    </button>
  );
};

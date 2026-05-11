export default function ResourceForm({ fields, form, lookups, onChange, onSubmit, onCancel, submitLabel = 'Enregistrer' }) {
  const getOptionLabel = (item, labelField) => {
    if (Array.isArray(labelField)) return labelField.map((field) => item[field]).filter(Boolean).join(' ');
    return item[labelField];
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const value = form[field.name] ?? '';
          if (field.type === 'textarea') {
            return (
              <label key={field.name} className="md:col-span-2">
                <span className="label">{field.label}</span>
                <textarea className="input min-h-28" value={value} required={field.required} onChange={(event) => onChange(field.name, event.target.value)} />
              </label>
            );
          }
          if (field.type === 'select') {
            const lookup = lookups[field.source] || { items: [], labelField: 'nom' };
            return (
              <label key={field.name}>
                <span className="label">{field.label}</span>
                <select className="input" value={value} required={field.required} onChange={(event) => onChange(field.name, event.target.value)}>
                  <option value="">Selectionner</option>
                  {lookup.items.map((item) => (
                    <option key={item.id} value={item.id}>{getOptionLabel(item, lookup.labelField)}</option>
                  ))}
                </select>
              </label>
            );
          }
          if (field.type === 'checkbox') {
            return (
              <label key={field.name} className="flex items-center gap-3 pt-7 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(field.name, event.target.checked)} />
                {field.label}
              </label>
            );
          }
          return (
            <label key={field.name}>
              <span className="label">{field.label}</span>
              <input className="input" type={field.type || 'text'} value={value} required={field.required} onChange={(event) => onChange(field.name, event.target.value)} />
            </label>
          );
        })}
      </div>
      <div className="flex justify-end gap-3">
        {onCancel && <button type="button" className="btn-secondary" onClick={onCancel}>Annuler</button>}
        <button type="submit" className="btn-primary">{submitLabel}</button>
      </div>
    </form>
  );
}

/* @ds-bundle: {"format":3,"namespace":"CircuitaDesignSystem_12e0ad","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Avatar","sourcePath":"components/surfaces/Avatar.jsx"},{"name":"Badge","sourcePath":"components/surfaces/Badge.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"658e01ceff79","components/buttons/IconButton.jsx":"4bd90ee92fdd","components/feedback/Dialog.jsx":"bbfd23e3ec0a","components/feedback/Toast.jsx":"55861367abc1","components/forms/Input.jsx":"7d36ba747f37","components/forms/Switch.jsx":"5a9a1bf0ea96","components/navigation/Tabs.jsx":"a877db344bd0","components/surfaces/Avatar.jsx":"996b68690753","components/surfaces/Badge.jsx":"3f4e8db000a2","components/surfaces/Card.jsx":"9c749a39026e","ui_kits/console/console.jsx":"cb2804bd8f7c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CircuitaDesignSystem_12e0ad = window.CircuitaDesignSystem_12e0ad || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tachyon Button — the primary action primitive.
 * Variants: primary (gold), secondary (glass), ghost, danger.
 */
function Button({
  variant = 'primary',
  size = 'md',
  icon = null,
  iconRight = null,
  loading = false,
  disabled = false,
  block = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const cls = ['cir-btn', `cir-btn--${variant}`, `cir-btn--${size}`, block ? 'cir-btn--block' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: cls,
    disabled: disabled || loading,
    "aria-busy": loading || undefined
  }, rest), loading && /*#__PURE__*/React.createElement("span", {
    className: "cir-btn__spin",
    "aria-hidden": "true"
  }), !loading && icon && /*#__PURE__*/React.createElement("span", {
    className: "cir-btn__icon",
    "aria-hidden": "true"
  }, icon), children && /*#__PURE__*/React.createElement("span", null, children), !loading && iconRight && /*#__PURE__*/React.createElement("span", {
    className: "cir-btn__icon",
    "aria-hidden": "true"
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tachyon IconButton — a square/round button holding a single icon.
 */
function IconButton({
  size = 'md',
  label,
  className = '',
  children,
  ...rest
}) {
  const cls = ['cir-iconbtn', `cir-iconbtn--${size}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    "aria-label": label,
    title: label
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
/**
 * Tachyon Dialog — a glass modal centered over a blurred scrim.
 * Render conditionally on `open`. Provide `actions` (nodes) for the footer.
 */
function Dialog({
  open = false,
  title,
  onClose,
  actions = null,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "cir-dialog__scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "cir-dialog",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    onClick: e => e.stopPropagation()
  }, title && /*#__PURE__*/React.createElement("h2", {
    className: "cir-dialog__title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "cir-dialog__body"
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    className: "cir-dialog__actions"
  }, actions)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tachyon Toast — a glass notification with a colored accent rail.
 */
function Toast({
  tone = 'info',
  title,
  icon = null,
  onClose,
  className = '',
  children,
  ...rest
}) {
  const cls = ['cir-toast', `cir-toast--${tone}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    role: "status"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "cir-toast__accent",
    "aria-hidden": "true"
  }), icon && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: `var(--${tone === 'info' ? 'info' : tone === 'success' ? 'success' : tone === 'warning' ? 'warning' : 'danger'})`,
      display: 'flex',
      marginTop: 1
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("p", {
    className: "cir-toast__title"
  }, title), children && /*#__PURE__*/React.createElement("p", {
    className: "cir-toast__msg"
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Dismiss",
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      padding: 2,
      lineHeight: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tachyon Input — a frosted text field with optional icon, label, hint/error.
 */
function Input({
  label,
  hint,
  error,
  icon = null,
  id,
  className = '',
  ...rest
}) {
  const fieldId = id || (label ? `cir-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const inputCls = ['cir-input', icon ? 'cir-input--has-icon' : '', error ? 'cir-input--invalid' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: "cir-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "cir-field__label",
    htmlFor: fieldId
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "cir-input-wrap"
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "cir-input__icon",
    "aria-hidden": "true"
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    className: inputCls,
    "aria-invalid": !!error || undefined
  }, rest))), error ? /*#__PURE__*/React.createElement("span", {
    className: "cir-field__err"
  }, error) : hint && /*#__PURE__*/React.createElement("span", {
    className: "cir-field__hint"
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tachyon Switch — a toggle. Controlled via `checked` + `onChange`.
 */
function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  id,
  ...rest
}) {
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  const onKey = e => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "cir-switch",
    "data-on": checked ? 'true' : 'false',
    role: "switch",
    "aria-checked": checked,
    "aria-disabled": disabled || undefined,
    tabIndex: disabled ? -1 : 0,
    onClick: toggle,
    onKeyDown: onKey
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "cir-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cir-switch__thumb"
  })), label && /*#__PURE__*/React.createElement("span", {
    className: "cir-switch__label"
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tachyon Tabs — a frosted segmented control.
 * Controlled via `value` + `onChange`; `items` is [{ value, label }].
 */
function Tabs({
  items = [],
  value,
  onChange,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['cir-tabs', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "cir-tabs__list",
    role: "tablist"
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.value,
    role: "tab",
    type: "button",
    className: "cir-tab",
    "data-active": value === it.value ? 'true' : 'false',
    "aria-selected": value === it.value,
    onClick: () => onChange && onChange(it.value)
  }, it.label))));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tachyon Avatar — image or initials, with optional status dot.
 */
function Avatar({
  src,
  name = '',
  size = 'md',
  status,
  className = '',
  ...rest
}) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const statusColor = {
    online: 'var(--success)',
    busy: 'var(--danger)',
    away: 'var(--warning)',
    offline: 'var(--text-faint)'
  }[status];
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['cir-avatar', `cir-avatar--${size}`, className].filter(Boolean).join(' '),
    style: {
      position: status ? 'relative' : undefined
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : /*#__PURE__*/React.createElement("span", null, initials || '?'), status && /*#__PURE__*/React.createElement("span", {
    className: "cir-avatar__status",
    style: {
      background: statusColor
    }
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tachyon Badge — a small status pill. Set `dot` for a leading status dot.
 */
function Badge({
  tone = 'neutral',
  dot = false,
  className = '',
  children,
  ...rest
}) {
  const cls = ['cir-badge', `cir-badge--${tone}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "cir-badge__dot",
    "aria-hidden": "true"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Badge.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tachyon Card — the signature frosted-glass surface.
 */
function Card({
  title,
  interactive = false,
  className = '',
  children,
  ...rest
}) {
  const cls = ['cir-card', interactive ? 'cir-card--interactive' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), title && /*#__PURE__*/React.createElement("h3", {
    className: "cir-card__title"
  }, title), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/console.jsx
try { (() => {
/* ============================================================
   Tachyon Console — bare-metal cloud product UI kit
   A single cohesive app composing the Tachyon DS primitives.
   Reads components from the compiled Tachyon DS bundle (window global).
   ============================================================ */
const DS = window[Object.keys(window).find(k => /DesignSystem_[0-9a-f]+$/.test(k))];
const {
  Button,
  IconButton,
  Input,
  Switch,
  Card,
  Badge,
  Avatar,
  Tabs,
  Dialog,
  Toast
} = DS;
const {
  useState,
  useEffect,
  useRef
} = React;

/* Lucide icon helper — re-inits on every render */
function Icon({
  n,
  size = 18,
  color,
  style
}) {
  return /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: size,
      height: size,
      color,
      ...style
    }
  });
}
function useLucide(dep) {
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
}

/* ---------- seed data ------------------------------------- */
const REGIONS = ['sa-east-1', 'fra-1', 'us-west-2'];
const TYPES = ['bare.metal.s', 'bare.metal.m', 'bare.metal.l', 'bare.gpu.a100'];
let UID = 100;
const seedNodes = [{
  id: 'cir-prod-01',
  region: 'sa-east-1',
  type: 'bare.metal.l',
  status: 'online',
  cpu: 38,
  mem: 52
}, {
  id: 'cir-prod-02',
  region: 'sa-east-1',
  type: 'bare.metal.l',
  status: 'online',
  cpu: 61,
  mem: 44
}, {
  id: 'cir-edge-fra',
  region: 'fra-1',
  type: 'bare.metal.m',
  status: 'online',
  cpu: 22,
  mem: 30
}, {
  id: 'cir-gpu-01',
  region: 'us-west-2',
  type: 'bare.gpu.a100',
  status: 'booting',
  cpu: 4,
  mem: 8
}];

/* ---------- Sidebar --------------------------------------- */
function Sidebar({
  nav,
  setNav
}) {
  useLucide();
  const items = [['overview', 'layout-dashboard', 'Overview'], ['nodes', 'cpu', 'Nodes'], ['network', 'network', 'Network'], ['storage', 'database', 'Storage'], ['billing', 'receipt', 'Billing'], ['settings', 'settings', 'Settings']];
  return /*#__PURE__*/React.createElement("aside", {
    className: "cc-sidebar glass-weak"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/emblem-primary.svg",
    alt: "Tachyon",
    className: "cc-brand__mark"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cc-brand__name"
  }, "Tachyon")), /*#__PURE__*/React.createElement("nav", {
    className: "cc-nav"
  }, items.map(([key, ic, label]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    className: "cc-nav__item",
    "data-active": nav === key ? 'true' : 'false',
    onClick: () => setNav(key)
  }, /*#__PURE__*/React.createElement(Icon, {
    n: ic,
    size: 18
  }), /*#__PURE__*/React.createElement("span", null, label)))), /*#__PURE__*/React.createElement("div", {
    className: "cc-sidebar__foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-user"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Ana Luiza",
    status: "online"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cc-user__meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cc-user__name"
  }, "Ana Luiza"), /*#__PURE__*/React.createElement("span", {
    className: "cc-user__org"
  }, "Ponte Tech")), /*#__PURE__*/React.createElement(IconButton, {
    label: "Account"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "chevron-up",
    size: 16
  })))));
}

/* ---------- Topbar ---------------------------------------- */
function Topbar({
  title,
  region,
  setRegion
}) {
  useLucide();
  return /*#__PURE__*/React.createElement("header", {
    className: "cc-topbar glass"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "Console"), /*#__PURE__*/React.createElement("h1", {
    className: "cc-topbar__title"
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "cc-topbar__tools"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-search"
  }, /*#__PURE__*/React.createElement(Input, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      n: "search",
      size: 16
    }),
    placeholder: "Search nodes, volumes\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cc-region"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "globe",
    size: 15
  }), /*#__PURE__*/React.createElement("select", {
    value: region,
    onChange: e => setRegion(e.target.value),
    className: "cc-region__sel"
  }, REGIONS.map(r => /*#__PURE__*/React.createElement("option", {
    key: r,
    value: r
  }, r)))), /*#__PURE__*/React.createElement(IconButton, {
    label: "Notifications"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "bell",
    size: 18
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Help"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "life-buoy",
    size: 18
  }))));
}

/* ---------- small pieces ---------------------------------- */
function Stat({
  icon,
  label,
  value,
  unit,
  delta,
  tone
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cc-stat glass"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-stat__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: `cc-stat__icon glass-${tone}`
  }, /*#__PURE__*/React.createElement(Icon, {
    n: icon,
    size: 18
  })), delta && /*#__PURE__*/React.createElement(Badge, {
    tone: delta > 0 ? 'sage' : 'orange'
  }, delta > 0 ? '▲' : '▼', " ", Math.abs(delta), "%")), /*#__PURE__*/React.createElement("div", {
    className: "cc-stat__value"
  }, value, /*#__PURE__*/React.createElement("span", {
    className: "cc-stat__unit"
  }, unit)), /*#__PURE__*/React.createElement("div", {
    className: "cc-stat__label"
  }, label));
}
function Meter({
  value,
  tone = 'gold'
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cc-meter"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cc-meter__fill",
    style: {
      width: `${value}%`,
      background: `var(--${tone === 'gold' ? 'accent' : tone})`
    }
  }));
}
const statusTone = {
  online: 'sage',
  booting: 'orange',
  offline: 'danger',
  draining: 'teal'
};
function NodeRow({
  node,
  onDeprovision
}) {
  useLucide();
  return /*#__PURE__*/React.createElement("div", {
    className: "cc-node glass"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-node__id"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cc-node__dot",
    "data-status": node.status
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cc-node__name text-mono"
  }, node.id), /*#__PURE__*/React.createElement("div", {
    className: "cc-node__sub"
  }, node.type, " \xB7 ", node.region))), /*#__PURE__*/React.createElement(Badge, {
    tone: statusTone[node.status],
    dot: true
  }, node.status), /*#__PURE__*/React.createElement("div", {
    className: "cc-node__metric"
  }, /*#__PURE__*/React.createElement("span", null, "CPU"), /*#__PURE__*/React.createElement(Meter, {
    value: node.cpu
  })), /*#__PURE__*/React.createElement("div", {
    className: "cc-node__metric"
  }, /*#__PURE__*/React.createElement("span", null, "MEM"), /*#__PURE__*/React.createElement(Meter, {
    value: node.mem,
    tone: "teal"
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Deprovision",
    onClick: () => onDeprovision(node)
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "trash-2",
    size: 16
  })));
}

/* ---------- Screens --------------------------------------- */
function Overview({
  nodes
}) {
  const online = nodes.filter(n => n.status === 'online').length;
  return /*#__PURE__*/React.createElement("div", {
    className: "cc-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-stats"
  }, /*#__PURE__*/React.createElement(Stat, {
    icon: "cpu",
    label: "Nodes online",
    value: online,
    unit: `/${nodes.length}`,
    delta: 12,
    tone: "gold"
  }), /*#__PURE__*/React.createElement(Stat, {
    icon: "gauge",
    label: "vCPUs provisioned",
    value: "384",
    unit: "",
    delta: 8,
    tone: "teal"
  }), /*#__PURE__*/React.createElement(Stat, {
    icon: "activity",
    label: "Throughput",
    value: "7.3",
    unit: "TB/s",
    delta: 5,
    tone: "sage"
  }), /*#__PURE__*/React.createElement(Stat, {
    icon: "receipt",
    label: "Spend (mtd)",
    value: "R$ 4.2",
    unit: "k",
    delta: -3,
    tone: "orange"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cc-cols"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Live nodes"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-nodelist"
  }, nodes.map(n => /*#__PURE__*/React.createElement(NodeRow, {
    key: n.id,
    node: n,
    onDeprovision: () => {}
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Activity"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "cc-feed"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "cc-feed__dot",
    style: {
      background: 'var(--success)'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "cir-prod-02"), " joined the pool", /*#__PURE__*/React.createElement("time", null, "2m"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "cc-feed__dot",
    style: {
      background: 'var(--warning)'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "fra-1"), " CPU above 90%", /*#__PURE__*/React.createElement("time", null, "14m"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "cc-feed__dot",
    style: {
      background: 'var(--info)'
    }
  }), /*#__PURE__*/React.createElement("div", null, "Volume ", /*#__PURE__*/React.createElement("b", null, "vol-7a2"), " attached", /*#__PURE__*/React.createElement("time", null, "38m"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "cc-feed__dot",
    style: {
      background: 'var(--accent)'
    }
  }), /*#__PURE__*/React.createElement("div", null, "Snapshot ", /*#__PURE__*/React.createElement("b", null, "snap-19"), " created", /*#__PURE__*/React.createElement("time", null, "1h")))))));
}
function Nodes({
  nodes,
  onProvision,
  onDeprovision
}) {
  const [tab, setTab] = useState('all');
  const filtered = nodes.filter(n => tab === 'all' ? true : n.status === tab);
  return /*#__PURE__*/React.createElement("div", {
    className: "cc-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-screen__head"
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: 'all',
      label: 'All'
    }, {
      value: 'online',
      label: 'Online'
    }, {
      value: 'booting',
      label: 'Booting'
    }]
  }), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      n: "plus",
      size: 16
    }),
    onClick: onProvision
  }, "Provision node")), /*#__PURE__*/React.createElement("div", {
    className: "cc-nodelist"
  }, filtered.length ? filtered.map(n => /*#__PURE__*/React.createElement(NodeRow, {
    key: n.id,
    node: n,
    onDeprovision: onDeprovision
  })) : /*#__PURE__*/React.createElement("div", {
    className: "cc-empty glass-weak"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "cpu",
    size: 28
  }), /*#__PURE__*/React.createElement("p", null, "No nodes in this view."))));
}
function Settings() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(true);
  return /*#__PURE__*/React.createElement("div", {
    className: "cc-screen cc-screen--narrow"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Cluster preferences"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-settings"
  }, /*#__PURE__*/React.createElement("label", {
    className: "cc-setting"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Auto-scale pool"), /*#__PURE__*/React.createElement("span", null, "Add nodes when sustained load exceeds 80%.")), /*#__PURE__*/React.createElement(Switch, {
    checked: a,
    onChange: setA
  })), /*#__PURE__*/React.createElement("label", {
    className: "cc-setting"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Maintenance mode"), /*#__PURE__*/React.createElement("span", null, "Pause scheduling and drain new work.")), /*#__PURE__*/React.createElement(Switch, {
    checked: b,
    onChange: setB
  })), /*#__PURE__*/React.createElement("label", {
    className: "cc-setting"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Spend alerts"), /*#__PURE__*/React.createElement("span", null, "Email when monthly spend passes budget.")), /*#__PURE__*/React.createElement(Switch, {
    checked: c,
    onChange: setC
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Default region"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-form"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Organisation",
    defaultValue: "Ponte Tech"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Budget (BRL / month)",
    defaultValue: "5000",
    icon: /*#__PURE__*/React.createElement(Icon, {
      n: "receipt",
      size: 15
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 12,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Reset"), /*#__PURE__*/React.createElement(Button, null, "Save changes"))));
}
function Placeholder({
  icon,
  title,
  note
}) {
  useLucide();
  return /*#__PURE__*/React.createElement("div", {
    className: "cc-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-empty cc-empty--lg glass"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cc-empty__ic glass-teal"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: icon,
    size: 26
  })), /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, note), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, "Not yet designed")));
}

/* ---------- App ------------------------------------------- */
function ConsoleApp() {
  const [nav, setNav] = useState('overview');
  const [region, setRegion] = useState('sa-east-1');
  const [nodes, setNodes] = useState(seedNodes);
  const [dialog, setDialog] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    type: TYPES[0]
  });
  useLucide();
  const titles = {
    overview: 'Overview',
    nodes: 'Nodes',
    network: 'Network',
    storage: 'Storage',
    billing: 'Billing',
    settings: 'Settings'
  };
  function pushToast(t) {
    const id = ++UID;
    setToasts(ts => [...ts, {
      ...t,
      id
    }]);
    setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 4200);
  }
  function provision() {
    const name = form.name.trim() || `cir-node-${UID + 1}`;
    const node = {
      id: name,
      region,
      type: form.type,
      status: 'booting',
      cpu: 3,
      mem: 6
    };
    setNodes(ns => [node, ...ns]);
    setDialog(false);
    setForm({
      name: '',
      type: TYPES[0]
    });
    pushToast({
      tone: 'info',
      title: 'Provisioning',
      msg: `${name} is booting in ${region}.`
    });
    setTimeout(() => {
      setNodes(ns => ns.map(n => n.id === name ? {
        ...n,
        status: 'online',
        cpu: 24,
        mem: 31
      } : n));
      pushToast({
        tone: 'success',
        title: 'Node online',
        msg: `${name} joined the ${region} pool.`
      });
    }, 2600);
  }
  function deprovision() {
    const node = confirm;
    setNodes(ns => ns.filter(n => n.id !== node.id));
    setConfirm(null);
    pushToast({
      tone: 'warning',
      title: 'Deprovisioned',
      msg: `${node.id} was removed.`
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "cc-app tachyon-bg"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    nav: nav,
    setNav: setNav
  }), /*#__PURE__*/React.createElement("div", {
    className: "cc-main"
  }, /*#__PURE__*/React.createElement(Topbar, {
    title: titles[nav],
    region: region,
    setRegion: setRegion
  }), /*#__PURE__*/React.createElement("div", {
    className: "cc-content"
  }, nav === 'overview' && /*#__PURE__*/React.createElement(Overview, {
    nodes: nodes
  }), nav === 'nodes' && /*#__PURE__*/React.createElement(Nodes, {
    nodes: nodes,
    onProvision: () => setDialog(true),
    onDeprovision: setConfirm
  }), nav === 'settings' && /*#__PURE__*/React.createElement(Settings, null), nav === 'network' && /*#__PURE__*/React.createElement(Placeholder, {
    icon: "network",
    title: "Network",
    note: "VPCs, subnets and firewall rules live here."
  }), nav === 'storage' && /*#__PURE__*/React.createElement(Placeholder, {
    icon: "database",
    title: "Storage",
    note: "Block volumes, snapshots and object buckets."
  }), nav === 'billing' && /*#__PURE__*/React.createElement(Placeholder, {
    icon: "receipt",
    title: "Billing",
    note: "Invoices, usage breakdown and payment methods."
  }))), /*#__PURE__*/React.createElement(Dialog, {
    open: dialog,
    title: "Provision a node",
    onClose: () => setDialog(false),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setDialog(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement(Icon, {
        n: "zap",
        size: 16
      }),
      onClick: provision
    }, "Provision"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-form"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Node name",
    placeholder: `cir-node-${UID + 1}`,
    value: form.name,
    onChange: e => setForm(f => ({
      ...f,
      name: e.target.value
    })),
    hint: `Region: ${region}`
  }), /*#__PURE__*/React.createElement("label", {
    className: "cir-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cir-field__label"
  }, "Instance type"), /*#__PURE__*/React.createElement("select", {
    className: "cir-input",
    value: form.type,
    onChange: e => setForm(f => ({
      ...f,
      type: e.target.value
    }))
  }, TYPES.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t)))))), /*#__PURE__*/React.createElement(Dialog, {
    open: !!confirm,
    title: "Deprovision node?",
    onClose: () => setConfirm(null),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setConfirm(null)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      onClick: deprovision
    }, "Deprovision"))
  }, "This permanently wipes ", /*#__PURE__*/React.createElement("b", {
    className: "text-mono"
  }, confirm && confirm.id), " and detaches its volumes. This cannot be undone."), /*#__PURE__*/React.createElement("div", {
    className: "cc-toasts"
  }, toasts.map(t => /*#__PURE__*/React.createElement(Toast, {
    key: t.id,
    tone: t.tone,
    title: t.title,
    icon: /*#__PURE__*/React.createElement(Icon, {
      n: t.tone === 'success' ? 'check-circle' : t.tone === 'warning' ? 'alert-triangle' : 'loader',
      size: 16
    }),
    onClose: () => setToasts(ts => ts.filter(x => x.id !== t.id))
  }, t.msg))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(ConsoleApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/console.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

})();

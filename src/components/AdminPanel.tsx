"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Mail,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  RefreshCw,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Guest {
  id: number;
  password: string;
  guest_name: string | null;
  guest_group: string;
  created_at: string;
}

interface Rsvp {
  id: number;
  password: string;
  guest_name: string;
  email: string;
  phone: string;
  attendance: string;
  guests: number;
  kids?: number;
  message: string | null;
  submitted_at: string;
}

type AdminTab = "guests" | "rsvps";

interface AdminPanelProps {
  dict: Dictionary;
  authPassword: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AdminPanel({ dict, authPassword }: AdminPanelProps) {
  const [tab, setTab] = useState<AdminTab>("guests");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Guest form state
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [formPassword, setFormPassword] = useState("");
  const [formName, setFormName] = useState("");
  const [formGroup, setFormGroup] = useState<string>("friends");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirm
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // RSVP expand
  const [expandedRsvp, setExpandedRsvp] = useState<number | null>(null);

  const headers = {
    "Content-Type": "application/json",
    "x-auth-password": authPassword,
  };

  /* ---- Data fetching ---- */

  const fetchGuests = useCallback(async () => {
    const res = await fetch("/api/admin/guests", { headers });
    if (!res.ok) throw new Error("Failed to load guests");
    return (await res.json()) as Guest[];
  }, [authPassword]);

  const fetchRsvps = useCallback(async () => {
    const res = await fetch("/api/admin/rsvps", { headers });
    if (!res.ok) throw new Error("Failed to load RSVPs");
    return (await res.json()) as Rsvp[];
  }, [authPassword]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [g, r] = await Promise.all([fetchGuests(), fetchRsvps()]);
      setGuests(g);
      setRsvps(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [fetchGuests, fetchRsvps]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ---- Guest form helpers ---- */

  const openNewForm = () => {
    setEditingGuest(null);
    setFormPassword("");
    setFormName("");
    setFormGroup("friends");
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (guest: Guest) => {
    setEditingGuest(guest);
    setFormPassword(guest.password);
    setFormName(guest.guest_name ?? "");
    setFormGroup(guest.guest_group);
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingGuest(null);
    setFormError(null);
  };

  const handleSave = async () => {
    if (!formPassword.trim()) {
      setFormError(dict.admin.passwordRequired);
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      const method = editingGuest ? "PUT" : "POST";
      const body = editingGuest
        ? { id: editingGuest.id, password: formPassword.trim(), guest_name: formName.trim(), guest_group: formGroup }
        : { password: formPassword.trim(), guest_name: formName.trim(), guest_group: formGroup };

      const res = await fetch("/api/admin/guests", {
        method,
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }

      await loadData();
      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/admin/guests", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      setGuests((prev) => prev.filter((g) => g.id !== id));
      setDeletingId(null);
    } catch {
      setError("Failed to delete guest");
    }
  };

  /* ---- Stats ---- */

  const totalGuests = guests.filter((g) => g.guest_group !== "admin").length;
  const totalRsvps = rsvps.length;
  const attending = rsvps.filter((r) => r.attendance === "yes");
  const totalAttendees = attending.reduce((sum, r) => sum + r.guests + (r.kids || 0), 0);
  const declined = rsvps.filter((r) => r.attendance === "no").length;

  /* ---- Render ---- */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2
          className="text-4xl md:text-5xl text-primary mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {dict.admin.title}
        </h2>
        <p className="text-warm-gray">{dict.admin.subtitle}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: dict.admin.totalGuests, value: totalGuests, icon: Users },
          { label: dict.admin.totalRsvps, value: totalRsvps, icon: Mail },
          { label: dict.admin.attending, value: totalAttendees, icon: UserCheck },
          { label: dict.admin.declined, value: declined, icon: UserX },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass-card rounded-2xl p-4 text-center">
            <Icon className="w-5 h-5 text-gold mx-auto mb-1" strokeWidth={1.5} />
            <p className="text-2xl font-bold text-primary-dark">{value}</p>
            <p className="text-xs text-warm-gray">{label}</p>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        {(["guests", "rsvps"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
              tab === t
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-warm-gray hover:text-primary hover:bg-accent/30"
            }`}
          >
            {t === "guests" ? <Users className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
            {t === "guests" ? dict.admin.guestsTab : dict.admin.rsvpsTab}
          </button>
        ))}
        <button
          onClick={loadData}
          className="ml-auto p-2.5 rounded-full text-warm-gray hover:text-primary hover:bg-accent/30 transition-all cursor-pointer"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose/10 border border-rose/30 rounded-xl text-rose text-sm text-center">
          {error}
        </div>
      )}

      {/* ================= GUESTS TAB ================= */}
      {tab === "guests" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={openNewForm}
              className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-xl text-sm font-medium hover:bg-gold/90 transition-all cursor-pointer hover:shadow-lg hover:shadow-gold/25"
            >
              <Plus className="w-4 h-4" />
              {dict.admin.addGuest}
            </button>
          </div>

          {/* Guest form modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-sm animate-fade-in">
              <div className="glass-card rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className="text-xl text-primary-dark"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {editingGuest ? dict.admin.editGuest : dict.admin.addGuest}
                  </h3>
                  <button
                    onClick={closeForm}
                    className="p-1 text-warm-gray hover:text-primary transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      {dict.admin.passwordLabel}
                    </label>
                    <input
                      type="text"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-accent focus:border-gold bg-white/80 text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                      placeholder={dict.admin.passwordPlaceholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      {dict.admin.nameLabel}
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-accent focus:border-gold bg-white/80 text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                      placeholder={dict.admin.namePlaceholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      {dict.admin.groupLabel}
                    </label>
                    <select
                      value={formGroup}
                      onChange={(e) => setFormGroup(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-accent focus:border-gold bg-white/80 text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all cursor-pointer"
                    >
                      <option value="friends">{dict.admin.groupFriends}</option>
                      <option value="family">{dict.admin.groupFamily}</option>
                      <option value="admin">{dict.admin.groupAdmin}</option>
                    </select>
                  </div>

                  {formError && (
                    <p className="text-rose text-sm text-center">{formError}</p>
                  )}

                  <button
                    onClick={handleSave}
                    disabled={formLoading}
                    className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {formLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        {dict.admin.save}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Guest list */}
          <div className="space-y-3">
            {guests.length === 0 ? (
              <p className="text-center text-warm-gray py-10">{dict.admin.noGuests}</p>
            ) : (
              guests.map((guest) => (
                <div
                  key={guest.id}
                  className="glass-card rounded-2xl p-4 flex items-center gap-4 group hover:shadow-lg transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-charcoal truncate">
                        {guest.guest_name || "—"}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          guest.guest_group === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : guest.guest_group === "family"
                            ? "bg-rose/10 text-rose"
                            : "bg-gold/15 text-gold"
                        }`}
                      >
                        {guest.guest_group}
                      </span>
                    </div>
                    <p className="text-sm text-warm-gray font-mono">{guest.password}</p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditForm(guest)}
                      className="p-2 text-warm-gray hover:text-primary hover:bg-accent/30 rounded-lg transition-all cursor-pointer"
                      title={dict.admin.editGuest}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {deletingId === guest.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(guest.id)}
                          className="p-2 text-white bg-rose rounded-lg hover:bg-rose/80 transition-all cursor-pointer"
                          title="Confirm"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="p-2 text-warm-gray hover:text-primary hover:bg-accent/30 rounded-lg transition-all cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingId(guest.id)}
                        className="p-2 text-warm-gray hover:text-rose hover:bg-rose/10 rounded-lg transition-all cursor-pointer"
                        title={dict.admin.deleteGuest}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= RSVPS TAB ================= */}
      {tab === "rsvps" && (
        <div className="space-y-3">
          {rsvps.length === 0 ? (
            <p className="text-center text-warm-gray py-10">{dict.admin.noRsvps}</p>
          ) : (
            rsvps.map((rsvp) => (
              <div key={rsvp.id} className="glass-card rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedRsvp(expandedRsvp === rsvp.id ? null : rsvp.id)}
                  className="w-full p-4 flex items-center gap-4 text-left cursor-pointer hover:bg-accent/10 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      rsvp.attendance === "yes"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-rose/10 text-rose"
                    }`}
                  >
                    {rsvp.attendance === "yes" ? (
                      <UserCheck className="w-5 h-5" />
                    ) : (
                      <UserX className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal truncate">{rsvp.guest_name}</p>
                    <p className="text-xs text-warm-gray">
                      {new Date(rsvp.submitted_at).toLocaleDateString()} · {rsvp.guests} {rsvp.guests === 1 ? "guest" : "guests"}{' '}
                      {typeof rsvp.kids !== 'undefined' && (
                        <span>· {rsvp.kids} {rsvp.kids === 1 ? "kid" : "kids"}</span>
                      )}
                    </p>
                  </div>

                  {expandedRsvp === rsvp.id ? (
                    <ChevronUp className="w-4 h-4 text-warm-gray flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-warm-gray flex-shrink-0" />
                  )}
                </button>

                {expandedRsvp === rsvp.id && (
                  <div className="px-4 pb-4 border-t border-accent/30 pt-3 animate-fade-in text-sm space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-warm-gray text-xs">{dict.admin.rsvpEmail}</p>
                        <p className="text-charcoal">{rsvp.email}</p>
                      </div>
                      <div>
                        <p className="text-warm-gray text-xs">{dict.admin.rsvpPhone}</p>
                        <p className="text-charcoal">{rsvp.phone}</p>
                      </div>
                      <div>
                        <p className="text-warm-gray text-xs">{dict.admin.rsvpAttendance}</p>
                        <p className={rsvp.attendance === "yes" ? "text-emerald-600" : "text-rose"}>
                          {rsvp.attendance === "yes" ? dict.admin.rsvpYes : dict.admin.rsvpNo}
                        </p>
                      </div>
                      <div>
                        <p className="text-warm-gray text-xs">{dict.admin.rsvpGuests}</p>
                        <p className="text-charcoal">{rsvp.guests}</p>
                      </div>
                      <div>
                        <p className="text-warm-gray text-xs">{dict.admin.rsvpKids}</p>
                        <p className="text-charcoal">{rsvp.kids ?? 0}</p>
                      </div>
                    </div>
                    {rsvp.message && (
                      <div>
                        <p className="text-warm-gray text-xs">{dict.admin.rsvpMessage}</p>
                        <p className="text-charcoal italic">&ldquo;{rsvp.message}&rdquo;</p>
                      </div>
                    )}
                    <div>
                      <p className="text-warm-gray text-xs">{dict.admin.rsvpPassword}</p>
                      <p className="text-charcoal font-mono text-xs">{rsvp.password}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

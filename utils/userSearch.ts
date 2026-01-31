import { User } from "@/types/user";
import { getRoleText } from "./roles";
import { normalizeText } from "./text";
import { parseQuery } from "./parseSearchQuery";

export function userMatches(user: User, rawQuery: string) {
    const { terms, filters } = parseQuery(rawQuery);
    if (terms.length === 0 && Object.keys(filters).length === 0)
        return true;

    const name = normalizeText(user.fullname);
    const email = normalizeText(user.email);
    const role = normalizeText(getRoleText(user.roles));

    // Build a searchable "haystack"
    const haystack = `${name} ${email} ${role}`;

    // Plain terms: require every term to be present somewhere
    const termsOk = terms.every((t) => haystack.includes(t));
    if (!termsOk) return false;

    for (const [key, vals] of Object.entries(filters)) {
        if (key === 'name') {
            if (!vals.every((v) => name.includes(v))) return false;
        } else if (key === 'email') {
            if (!vals.every((v) => email.includes(v))) return false;
        } else if (key === 'role') {
            if (!vals.every((v) => role.includes(v))) return false;
        } else {
            // Unknown filters fallback to general search
            if (!vals.every((v) => haystack.includes(v))) return false;
        }
    }

    return true;
}

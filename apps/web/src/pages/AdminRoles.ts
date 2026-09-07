import { AuthService } from "@web/services/AuthService";
import "@web/components/AdminSidebarComponent";
import "@web/components/roles/RolesPageComponent";

void new AuthService().checkAdminAccess();

import AdminLayout from "@/components/admin/AdminLayout"
import AdminExhibitions from "@/components/admin/exhibitions/AdminExhibitions"

const AdminExhibitionsFragment = () => {
  return (
    <AdminLayout pageTitle="Exhibitions">
      <AdminExhibitions/>
    </AdminLayout>
  )
}

export default AdminExhibitionsFragment

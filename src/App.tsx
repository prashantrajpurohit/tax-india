import RootLayout from "@/app/layout";
import Home from "@/app/page";
import Dashboard from "@/app/dashboard/page";
import Login from "@/app/login/page";
import User from "@/app/user/page";
import Staff from "@/app/staff/page";
import StaffAdd from "@/app/staff/add/page";
import PanApplication from "@/app/pan-application/page";
import PanApplicationAdd from "@/app/pan-application/add/page";
import GstApplication from "@/app/gst-application/page";
import GstApplicationAdd from "@/app/gst-application/add/page";
import ItrApplication from "@/app/itr-application/page";
import ItrApplicationAdd from "@/app/itr-application/add/page";
import AadhaarChange from "@/app/aadhar-change/page";
import AadhaarChangeAdd from "@/app/aadhar-change/add/page";
import FindAadhaarCard from "@/app/find-aadhar-card/page";
import FindAadhaarCardAdd from "@/app/find-aadhar-card/add/page";
import FindPanCard from "@/app/find-pan-card/page";
import FindPanCardAdd from "@/app/find-pan-card/add/page";
import PrintPvc from "@/app/print-pvc/page";
import PrintPvcAdd from "@/app/print-pvc/add/page";
import DownloadVoterCard from "@/app/download-voter-card/page";
import DownloadVoterCardAdd from "@/app/download-voter-card/add/page";
import PriceListing from "@/app/price-listing/page";
import PriceListingAdd from "@/app/price-listing/add/page";
import Designation from "@/app/designation/page";
import Module from "@/app/module/page";
import NotFound from "@/app/not-found";
import { Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<User />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/staff/add" element={<StaffAdd />} />

        <Route path="/pan-application" element={<PanApplication />} />
        <Route path="/pan-application/add" element={<PanApplicationAdd />} />
        <Route path="/gst-application" element={<GstApplication />} />
        <Route path="/gst-application/add" element={<GstApplicationAdd />} />
        <Route path="/itr-application" element={<ItrApplication />} />
        <Route path="/itr-application/add" element={<ItrApplicationAdd />} />
        <Route path="/aadhar-change" element={<AadhaarChange />} />
        <Route path="/aadhar-change/add" element={<AadhaarChangeAdd />} />
        <Route path="/find-aadhar-card" element={<FindAadhaarCard />} />
        <Route path="/find-aadhar-card/add" element={<FindAadhaarCardAdd />} />
        <Route path="/find-pan-card" element={<FindPanCard />} />
        <Route path="/find-pan-card/add" element={<FindPanCardAdd />} />
        <Route path="/print-pvc" element={<PrintPvc />} />
        <Route path="/print-pvc/add" element={<PrintPvcAdd />} />
        <Route path="/download-voter-card" element={<DownloadVoterCard />} />
        <Route
          path="/download-voter-card/add"
          element={<DownloadVoterCardAdd />}
        />
        <Route path="/price-listing" element={<PriceListing />} />
        <Route path="/price-listing/add" element={<PriceListingAdd />} />
        <Route path="/designation" element={<Designation />} />
        <Route path="/module" element={<Module />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RootLayout>
  );
}

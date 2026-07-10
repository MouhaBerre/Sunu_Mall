from django.urls import path
from .views import (
    SellerOverviewView,
    AdminOverviewView,
    BestSellersView,
    TopRatedView,
    TrendsView,
    TrafficView,
    TrackPageViewView,
    LiveSalesSnapshotView,
)

urlpatterns = [
    path("seller/overview/", SellerOverviewView.as_view(), name="analytics_seller_overview"),
    path("admin/overview/", AdminOverviewView.as_view(), name="analytics_admin_overview"),
    path("products/best-sellers/", BestSellersView.as_view(), name="analytics_best_sellers"),
    path("products/top-rated/", TopRatedView.as_view(), name="analytics_top_rated"),
    path("trends/", TrendsView.as_view(), name="analytics_trends"),
    path("traffic/", TrafficView.as_view(), name="analytics_traffic"),
    path("track/", TrackPageViewView.as_view(), name="analytics_track"),
    path("sales/live/", LiveSalesSnapshotView.as_view(), name="analytics_sales_live"),
]

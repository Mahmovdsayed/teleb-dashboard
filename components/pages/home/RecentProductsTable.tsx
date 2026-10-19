'use client';

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Plus } from "lucide-react";
import { Product } from "@/types/Product.types";
import { Collection } from "@/types/Collection.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/EmptyState";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import AppPagination from "@/components/ui/AppPagination";
import ProductTableRow from "./ProductTableRow";

interface RecentProductsTableProps {
  products: Product[];
  collections: Collection[];
  isLoading: boolean;
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
}

export default function RecentProductsTable({
  products,
  collections,
  isLoading,
  total,
  currentPage,
  onPageChange,
  onRefetch,
}: RecentProductsTableProps) {
  const tHome = useTranslations("dashboard.home");
  const tResources = useTranslations("dashboard.resources");

  return (
    <Card className="border-border/70 bg-card shadow-none">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          <CardTitle className="text-sm sm:text-base font-bold">{tHome("table.title")}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{tHome("table.description")}</CardDescription>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/products" />}
            className="text-xs h-8 gap-1.5"
          >
            <span>{tHome("table.viewAll")}</span>
            <ArrowUpRight className="size-3.5" />
          </Button>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/products/add" />}
            className="text-xs h-8 gap-1.5"
          >
            <Plus className="size-3.5" />
            <span>{tResources("add")}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading && !products.length ? (
          <TableSkeleton rows={5} />
        ) : products.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title={tHome("table.noProducts")}
              description={tHome("table.noProductsDesc")}
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/60">
                <TableHead className="w-14 text-center text-xs font-semibold">{tHome("table.image")}</TableHead>
                <TableHead className="text-xs font-semibold">{tHome("table.name")}</TableHead>
                <TableHead className="hidden md:table-cell text-xs font-semibold">{tHome("table.collection")}</TableHead>
                <TableHead className="text-center text-xs font-semibold">{tHome("table.status")}</TableHead>
                <TableHead className="hidden lg:table-cell text-center text-xs font-semibold">{tHome("table.warranty")}</TableHead>
                <TableHead className="hidden xl:table-cell text-xs font-semibold">{tHome("table.createdAt")}</TableHead>
                <TableHead className="text-end pe-4 text-xs font-semibold">{tHome("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  collections={collections}
                  onRefetch={onRefetch}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>


      {total > 10 && (
        <div className="pb-4">
          <AppPagination
            total={total}
            pageSize={10}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </Card>
  );
}

import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TicketEntity } from "../types/ticket.entity";
import { SelectOption } from "@/shared/types/select-option.types";

interface AsignarSoporteModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketEntity | null;
  trabajadoresOptions: SelectOption<number>[];
  loadingTrabajadores?: boolean;
  onAssign: (ticketId: number, soporteId: number) => Promise<void>;
  isSubmitting?: boolean;
}

export const AsignarSoporteModal: React.FC<AsignarSoporteModalProps> = ({
  isOpen,
  onClose,
  ticket,
  trabajadoresOptions = [],
  loadingTrabajadores = false,
  onAssign,
  isSubmitting = false,
}) => {
  const [selectedSoporteId, setSelectedSoporteId] = useState<number | null>(
    null,
  );
  const [openPopover, setOpenPopover] = useState(false);

  const selectedTrabajador = trabajadoresOptions.find(
    (opt) => opt.value === selectedSoporteId,
  );

  const handleConfirm = async () => {
    if (!ticket || !selectedSoporteId) return;
    await onAssign(ticket.id_tickets, selectedSoporteId);
    setSelectedSoporteId(null);
    onClose();
  };

  const handleModalClose = () => {
    setSelectedSoporteId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Asignar soporte al ticket</DialogTitle>
        </DialogHeader>

        {ticket && (
          <div className="grid gap-4 py-2">
            {/* Resumen del ticket */}
            <div className="rounded-md bg-muted p-3 text-sm flex items-center gap-2">
              <span className="font-semibold text-primary">#{ticket.pin}</span>
              <span className="text-muted-foreground">·</span>
              <span className="truncate text-foreground font-medium">
                {ticket.asunto}
              </span>
            </div>

            {/* Búsqueda y Selección de Soporte (Combobox de shadcn) */}
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Seleccionar soporte
              </label>

              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openPopover}
                    className={cn(
                      "w-full justify-between font-normal",
                      !selectedSoporteId && "text-muted-foreground",
                    )}
                    disabled={loadingTrabajadores || isSubmitting}
                  >
                    <span className="truncate">
                      {loadingTrabajadores
                        ? "Cargando soportes..."
                        : selectedTrabajador
                          ? selectedTrabajador.label
                          : "Buscar por nombre..."}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {selectedSoporteId && (
                        <X
                          className="h-4 w-4 opacity-50 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSoporteId(null);
                          }}
                        />
                      )}
                      <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </div>
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="p-0 w-[var(--radix-popover-trigger-width)]"
                  align="start"
                >
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar por nombre..." />
                    <CommandList>
                      <CommandEmpty>
                        No se encontraron usuarios de soporte.
                      </CommandEmpty>
                      <CommandGroup>
                        {trabajadoresOptions.map((opt) => (
                          <CommandItem
                            key={opt.value}
                            value={opt.label}
                            onSelect={() => {
                              setSelectedSoporteId(opt.value);
                              setOpenPopover(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                opt.value === selectedSoporteId
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {opt.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Footer estándar de shadcn */}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleModalClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedSoporteId || isSubmitting}
          >
            {isSubmitting ? "Asignando..." : "Asignar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

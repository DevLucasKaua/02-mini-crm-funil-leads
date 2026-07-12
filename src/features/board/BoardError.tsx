import { Button, EmptyState } from '../../components/ui';

interface BoardErrorProps {
  onRetry: () => void;
}

export function BoardError({ onRetry }: BoardErrorProps) {
  return (
    <div className="py-8">
      <EmptyState
        title="Não foi possível carregar os leads"
        description="Ocorreu um erro ao buscar o funil. Verifique sua conexão e tente novamente."
        action={
          <Button variant="secondary" onClick={onRetry}>
            Tentar novamente
          </Button>
        }
      />
    </div>
  );
}

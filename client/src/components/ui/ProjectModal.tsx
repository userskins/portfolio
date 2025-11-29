import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Project } from '@/lib/data';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  const getModalContent = () => {
    switch (project.tag) {
      case 'design':
        return {
          message: 'Переходя по ссылке дальше, вы попадёте на проект, располагающийся на сервисе Figma',
        };
      case 'animation':
        return {
          message: 'Переходя по ссылке дальше, вы попадёте на проект, располагающийся на сервисе Яндекс.Диске',
        };
      case 'email':
        return {
          message: 'Переходя по ссылке дальше, вы попадёте на проект, располагающийся на сервисе EmailMaker',
        };
      case 'websites':
        return {
          message: 'Переходя по ссылке дальше, вы откроете сторонний сайт',
        };
      default:
        return {
          message: 'Переходя по ссылке дальше, вы откроете проект',
        };
    }
  };

  const content = getModalContent();

  const handleOpenProject = () => {
    if (project.url) {
      window.open(project.url, '_blank');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-lg font-semibold text-white">{project.title}</h2>
          <p className="text-sm text-white/80">{content.message}</p>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-testid="button-modal-cancel"
            >
              Отмена
            </Button>
            <Button
              onClick={handleOpenProject}
              className="flex-1"
              data-testid="button-modal-open"
            >
              Хорошо
            </Button>
          </div>
          {project.url && (
            <p className="text-xs text-white/60 break-all pt-2 max-h-20 overflow-y-auto">
              {project.url}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
